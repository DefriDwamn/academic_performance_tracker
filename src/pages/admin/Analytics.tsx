'use client'

import { useEffect, useState, useRef } from 'react'
import {
  Box,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Text,
  SimpleGrid,
  Select,
  HStack,
  VStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  Divider,
} from '@chakra-ui/react'
import { useAnalyticsStore } from '../../store/analyticsStore'
import { useStudentStore } from '../../store/studentStore'
import { AnimatedElement } from '../../components/common/AnimatedElement'
import { CustomTooltip } from '../../components/charts/CustomTooltip'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'

export default function AdminAnalytics() {
  const {
    performanceMetrics,
    attendanceStatistics,
    studentReport,
    fetchPerformanceMetrics,
    fetchAttendanceStatistics,
    fetchStudentReport,
    isLoading,
  } = useAnalyticsStore()
  const { students, fetchStudents } = useStudentStore()
  const [selectedStudent, setSelectedStudent] = useState<string>('')
  const [containerSizes, setContainerSizes] = useState<{
    [key: string]: { width: number; height: number }
  }>({})
  const containerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  useEffect(() => {
    const updateContainerSizes = () => {
      const newSizes: { [key: string]: { width: number; height: number } } = {}
      Object.entries(containerRefs.current).forEach(([key, element]) => {
        if (element) {
          const rect = element.getBoundingClientRect()
          newSizes[key] = { width: rect.width, height: rect.height }
        }
      })
      setContainerSizes(newSizes)
    }

    updateContainerSizes()
    // Force update after a small delay to ensure all containers are properly sized
    const timer = setTimeout(updateContainerSizes, 100)
    window.addEventListener('resize', updateContainerSizes)
    return () => {
      window.removeEventListener('resize', updateContainerSizes)
      clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    fetchPerformanceMetrics()
    fetchAttendanceStatistics()
    fetchStudents()
  }, [fetchPerformanceMetrics, fetchAttendanceStatistics, fetchStudents])

  useEffect(() => {
    if (selectedStudent) {
      fetchStudentReport(selectedStudent)
    }
  }, [selectedStudent, fetchStudentReport])

  // Colors for charts
  const COLORS = ['#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd']
  const GRADE_COLORS = {
    A: '#22c55e',
    B: '#3b82f6',
    C: '#eab308',
    D: '#f97316',
    F: '#ef4444',
  }

  // Prepare data for grade distribution pie chart
  const prepareGradeDistributionData = () => {
    if (!performanceMetrics?.coursePerformance) return []

    const gradeDistribution = performanceMetrics.coursePerformance.reduce(
      (acc, course) => {
        course.gradeDistribution.forEach((grade) => {
          const existingGrade = acc.find((g) => g.name === grade.letterGrade)
          if (existingGrade) {
            existingGrade.value += grade.count
          } else {
            acc.push({ name: grade.letterGrade, value: grade.count })
          }
        })
        return acc
      },
      [] as { name: string; value: number }[]
    )

    // Sort by grade (A, B, C, D, F)
    return gradeDistribution.sort((a, b) => {
      const gradeOrder = { A: 0, B: 1, C: 2, D: 3, F: 4 }
      return (
        gradeOrder[a.name as keyof typeof gradeOrder] -
        gradeOrder[b.name as keyof typeof gradeOrder]
      )
    })
  }

  // Prepare data for GPA trend chart
  const prepareGPATrendData = () => {
    if (!performanceMetrics?.semesterGPA) return []

    return Object.entries(performanceMetrics.semesterGPA).map(([semester, gpa]) => ({
      semester,
      gpa,
    }))
  }

  // Prepare data for course performance bar chart
  const prepareCoursePerformanceData = () => {
    if (!performanceMetrics?.coursePerformance) return []

    return performanceMetrics.coursePerformance.map((course) => ({
      name:
        course.courseName.length > 15
          ? course.courseName.substring(0, 15) + '...'
          : course.courseName,
      average: course.averageGrade,
      highest: course.highestGrade,
      lowest: course.lowestGrade,
    }))
  }

  // Prepare data for monthly attendance chart
  const prepareMonthlyAttendanceData = () => {
    if (!attendanceStatistics?.monthlyAttendance) return []

    return attendanceStatistics.monthlyAttendance.map((month) => ({
      name: month.month,
      rate: month.attendanceRate,
    }))
  }

  // Prepare data for student performance comparison
  const prepareStudentPerformanceData = () => {
    if (!studentReport?.academicPerformance) return []

    return studentReport.academicPerformance.semesterPerformance.map((semester) => ({
      name: semester.semester,
      studentGPA: semester.gpa,
      classAverage: (Math.random() * 1.5 + 2.5).toFixed(2), // Mock data for class average
    }))
  }

  const gradeDistributionData = prepareGradeDistributionData()
  const gpaTrendData = prepareGPATrendData()
  const coursePerformanceData = prepareCoursePerformanceData()
  const monthlyAttendanceData = prepareMonthlyAttendanceData()
  const studentPerformanceData = prepareStudentPerformanceData()

  const renderChart = (chartId: string, children: React.ReactElement) => {
    const size = containerSizes[chartId]
    if (!size || size.width === 0 || size.height === 0) {
      return null
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    )
  }

  return (
    <Box>
      <AnimatedElement animation="fadeIn">
        <Heading size="lg" mb={6}>
          Academic Analytics
        </Heading>
      </AnimatedElement>

      <Tabs variant="enclosed" colorScheme="brand" isLazy>
        <TabList mb={6} overflowX="auto" overflowY="hidden" css={{
          scrollbarWidth: 'none',
          '::-webkit-scrollbar': {
            display: 'none'
          }
        }}>
          <Tab whiteSpace="nowrap">System Overview</Tab>
          <Tab whiteSpace="nowrap">Student Analysis</Tab>
          <Tab whiteSpace="nowrap">Course Analysis</Tab>
          <Tab whiteSpace="nowrap">Attendance Analysis</Tab>
        </TabList>

        <TabPanels>
          {/* System Overview Tab */}
          <TabPanel p={0}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
              <AnimatedElement animation="slideUp" delay={100}>
                <Card>
                  <CardHeader>
                    <Heading size="md">Grade Distribution</Heading>
                  </CardHeader>
                  <CardBody>
                    {isLoading ? (
                      <Box height="300px" bg="gray.100" />
                    ) : (
                      <Box
                        key="gradeDistribution"
                        ref={(el) => (containerRefs.current['gradeDistribution'] = el)}
                        height={{ base: "250px", md: "400px" }}
                        minHeight="250px"
                        width="100%"
                        position="relative"
                        mb={4}
                      >
                        {renderChart(
                          'gradeDistribution',
                          <PieChart margin={{ top: 0, right: 0, bottom: 40, left: 0 }}>
                            <Pie
                              data={gradeDistributionData}
                              cx="50%"
                              cy="45%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={false}
                            >
                              {gradeDistributionData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={
                                    GRADE_COLORS[entry.name as keyof typeof GRADE_COLORS] ||
                                    COLORS[index % COLORS.length]
                                  }
                                />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend 
                              layout="horizontal" 
                              verticalAlign="bottom" 
                              align="center"
                              wrapperStyle={{
                                paddingTop: '20px',
                                fontSize: '12px'
                              }}
                            />
                          </PieChart>
                        )}
                      </Box>
                    )}
                  </CardBody>
                </Card>
              </AnimatedElement>

              <AnimatedElement animation="slideUp" delay={200}>
                <Card>
                  <CardHeader>
                    <Heading size="md">GPA Trend</Heading>
                  </CardHeader>
                  <CardBody>
                    {isLoading ? (
                      <Box height="300px" bg="gray.100" />
                    ) : (
                      <Box
                        key="gpaTrend"
                        ref={(el) => (containerRefs.current['gpaTrend'] = el)}
                        height={{ base: "250px", md: "400px" }}
                        minHeight="250px"
                        width="100%"
                        position="relative"
                        mb={4}
                      >
                        {renderChart(
                          'gpaTrend',
                          <LineChart
                            data={gpaTrendData}
                            margin={{
                              top: 5,
                              right: 20,
                              left: 0,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="semester" />
                            <YAxis domain={[0, 4]} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="gpa"
                              stroke="#0284c7"
                              activeDot={{ r: 8 }}
                            />
                          </LineChart>
                        )}
                      </Box>
                    )}
                  </CardBody>
                </Card>
              </AnimatedElement>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <AnimatedElement animation="slideUp" delay={300}>
                <Card>
                  <CardHeader>
                    <Heading size="md">Course Performance</Heading>
                  </CardHeader>
                  <CardBody>
                    {isLoading ? (
                      <Box height="300px" bg="gray.100" />
                    ) : (
                      <Box
                        key="coursePerformance"
                        ref={(el) => (containerRefs.current['coursePerformance'] = el)}
                        height={{ base: "250px", md: "400px" }}
                        minHeight="250px"
                        width="100%"
                        position="relative"
                        mb={4}
                      >
                        {renderChart(
                          'coursePerformance',
                          <BarChart
                            data={coursePerformanceData}
                            margin={{
                              top: 5,
                              right: 20,
                              left: 0,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="average" fill="#0284c7" name="Average" />
                            <Bar dataKey="highest" fill="#22c55e" name="Highest" />
                            <Bar dataKey="lowest" fill="#ef4444" name="Lowest" />
                          </BarChart>
                        )}
                      </Box>
                    )}
                  </CardBody>
                </Card>
              </AnimatedElement>

              <AnimatedElement animation="slideUp" delay={400}>
                <Card>
                  <CardHeader>
                    <Heading size="md">Monthly Attendance</Heading>
                  </CardHeader>
                  <CardBody>
                    {isLoading ? (
                      <Box height="300px" bg="gray.100" />
                    ) : (
                      <Box
                        key="monthlyAttendance"
                        ref={(el) => (containerRefs.current['monthlyAttendance'] = el)}
                        height={{ base: "250px", md: "400px" }}
                        minHeight="250px"
                        width="100%"
                        position="relative"
                        mb={4}
                      >
                        {renderChart(
                          'monthlyAttendance',
                          <AreaChart
                            data={monthlyAttendanceData}
                            margin={{
                              top: 5,
                              right: 20,
                              left: 0,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Area
                              type="monotone"
                              dataKey="rate"
                              stroke="#22c55e"
                              fill="#22c55e"
                              fillOpacity={0.3}
                              name="Attendance Rate %"
                            />
                          </AreaChart>
                        )}
                      </Box>
                    )}
                  </CardBody>
                </Card>
              </AnimatedElement>
            </SimpleGrid>
          </TabPanel>

          {/* Student Analysis Tab */}
          <TabPanel p={0}>
            <AnimatedElement animation="slideUp" delay={100}>
              <Card mb={6}>
                <CardHeader>
                  <Heading size="md">Student Performance Analysis</Heading>
                </CardHeader>
                <CardBody>
                  <Box mb={6}>
                    <Text mb={2} fontWeight="medium">
                      Select Student
                    </Text>
                    <Select
                      placeholder="Select a student"
                      value={selectedStudent}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                    >
                      {students.map((student) => (
                        <option key={student._id} value={student._id}>
                          {`${student.firstName} ${student.lastName} (${student.studentId})`}
                        </option>
                      ))}
                    </Select>
                  </Box>

                  {selectedStudent && studentReport ? (
                    <Box>
                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
                        <Stat>
                          <StatLabel>Current GPA</StatLabel>
                          <StatNumber>
                            {studentReport.academicPerformance.currentGPA.toFixed(2)}
                          </StatNumber>
                          <StatHelpText>Out of 4.0</StatHelpText>
                        </Stat>
                        <Stat>
                          <StatLabel>Completed Credits</StatLabel>
                          <StatNumber>{studentReport.academicPerformance.totalCredits}</StatNumber>
                          <StatHelpText>
                            {studentReport.academicPerformance.completedCourses} courses
                          </StatHelpText>
                        </Stat>
                        <Stat>
                          <StatLabel>Attendance Rate</StatLabel>
                          <StatNumber>
                            {studentReport.attendanceRecord.overallAttendanceRate.toFixed(1)}%
                          </StatNumber>
                          <StatHelpText>
                            {studentReport.attendanceRecord.absenceCount} absences
                          </StatHelpText>
                        </Stat>
                      </SimpleGrid>

                      <Divider my={6} />

                      <Heading size="sm" mb={4}>
                        Performance Comparison
                      </Heading>
                      <Box
                        key="studentPerformance"
                        height={{ base: "250px", md: "400px" }}
                        minHeight="250px"
                        width="100%"
                        position="relative"
                        mb={4}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={studentPerformanceData}
                            margin={{
                              top: 5,
                              right: 20,
                              left: 0,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 4]} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="studentGPA"
                              stroke="#0284c7"
                              name="Student GPA"
                              activeDot={{ r: 8 }}
                            />
                            <Line
                              type="monotone"
                              dataKey="classAverage"
                              stroke="#22c55e"
                              name="Class Average"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </Box>

                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <Box>
                          <Heading size="sm" mb={4}>
                            Grade Distribution
                          </Heading>
                          <Box
                            key="studentGradeDistribution"
                            height={{ base: "250px", md: "400px" }}
                            minHeight="250px"
                            width="100%"
                            position="relative"
                            mb={4}
                          >
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart margin={{ top: 0, right: 0, bottom: 40, left: 0 }}>
                                <Pie
                                  data={studentReport.academicPerformance.gradeDistribution}
                                  cx="50%"
                                  cy="45%"
                                  labelLine={false}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="count"
                                  nameKey="letterGrade"
                                  label={false}
                                >
                                  {studentReport.academicPerformance.gradeDistribution.map(
                                    (entry, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={
                                          GRADE_COLORS[
                                            entry.letterGrade as keyof typeof GRADE_COLORS
                                          ] || COLORS[index % COLORS.length]
                                        }
                                      />
                                    )
                                  )}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend 
                                  layout="horizontal" 
                                  verticalAlign="bottom" 
                                  align="center"
                                  wrapperStyle={{
                                    paddingTop: '20px',
                                    fontSize: '12px'
                                  }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </Box>
                        </Box>

                        <Box>
                          <Heading size="sm" mb={4}>
                            Course Attendance
                          </Heading>
                          <Box
                            key="studentCourseAttendance"
                            height={{ base: "250px", md: "400px" }}
                            minHeight="250px"
                            width="100%"
                            position="relative"
                            mb={4}
                          >
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={studentReport.attendanceRecord.courseAttendance}
                                margin={{
                                  top: 5,
                                  right: 20,
                                  left: 0,
                                  bottom: 5,
                                }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="courseName" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar
                                  dataKey="attendanceRate"
                                  fill="#22c55e"
                                  name="Attendance Rate %"
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </Box>
                        </Box>
                      </SimpleGrid>
                    </Box>
                  ) : (
                    <Text color="gray.500" textAlign="center" py={10}>
                      {selectedStudent
                        ? 'Loading student data...'
                        : 'Select a student to view detailed performance analysis'}
                    </Text>
                  )}
                </CardBody>
              </Card>
            </AnimatedElement>
          </TabPanel>

          {/* Course Analysis Tab */}
          <TabPanel p={0}>
            <AnimatedElement animation="slideUp" delay={100}>
              <Card>
                <CardHeader>
                  <Heading size="md">Course Performance Analysis</Heading>
                </CardHeader>
                <CardBody>
                  {performanceMetrics?.coursePerformance ? (
                    <VStack spacing={8} align="stretch">
                      {performanceMetrics.coursePerformance.map((course) => (
                        <Box key={course.courseId}>
                          <Heading size="sm" mb={4}>
                            {course.courseName}
                          </Heading>
                          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={4}>
                            <Stat>
                              <StatLabel>Average Grade</StatLabel>
                              <StatNumber>{course.averageGrade.toFixed(1)}%</StatNumber>
                              <HStack>
                                <Badge
                                  colorScheme={
                                    course.averageGrade >= 80
                                      ? 'green'
                                      : course.averageGrade >= 70
                                        ? 'blue'
                                        : 'yellow'
                                  }
                                >
                                  {course.averageGrade >= 90
                                    ? 'Excellent'
                                    : course.averageGrade >= 80
                                      ? 'Good'
                                      : course.averageGrade >= 70
                                        ? 'Average'
                                        : 'Needs Improvement'}
                                </Badge>
                              </HStack>
                            </Stat>
                            <Stat>
                              <StatLabel>Highest Grade</StatLabel>
                              <StatNumber>{course.highestGrade.toFixed(1)}%</StatNumber>
                            </Stat>
                            <Stat>
                              <StatLabel>Lowest Grade</StatLabel>
                              <StatNumber>{course.lowestGrade.toFixed(1)}%</StatNumber>
                            </Stat>
                          </SimpleGrid>

                          <Box
                            key={`courseGradeDistribution-${course.courseId}`}
                            height={{ base: "250px", md: "400px" }}
                            minHeight="250px"
                            width="100%"
                            position="relative"
                            mb={4}
                          >
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart margin={{ top: 0, right: 0, bottom: 40, left: 0 }}>
                                <Pie
                                  data={course.gradeDistribution}
                                  cx="50%"
                                  cy="45%"
                                  labelLine={false}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="count"
                                  nameKey="letterGrade"
                                  label={false}
                                >
                                  {course.gradeDistribution.map((entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={
                                        GRADE_COLORS[
                                          entry.letterGrade as keyof typeof GRADE_COLORS
                                        ] || COLORS[index % COLORS.length]
                                      }
                                    />
                                  ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend 
                                  layout="horizontal" 
                                  verticalAlign="bottom" 
                                  align="center"
                                  wrapperStyle={{
                                    paddingTop: '20px',
                                    fontSize: '12px'
                                  }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </Box>
                          <Divider />
                        </Box>
                      ))}
                    </VStack>
                  ) : (
                    <Text color="gray.500" textAlign="center" py={10}>
                      No course performance data available
                    </Text>
                  )}
                </CardBody>
              </Card>
            </AnimatedElement>
          </TabPanel>

          {/* Attendance Analysis Tab */}
          <TabPanel p={0}>
            <AnimatedElement animation="slideUp" delay={100}>
              <Card>
                <CardHeader>
                  <Heading size="md">Attendance Analysis</Heading>
                </CardHeader>
                <CardBody>
                  {attendanceStatistics ? (
                    <Box>
                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
                        <Stat>
                          <StatLabel>Overall Attendance Rate</StatLabel>
                          <StatNumber>
                            {attendanceStatistics.overallAttendanceRate.toFixed(1)}%
                          </StatNumber>
                          <StatHelpText>
                            <Badge
                              colorScheme={
                                attendanceStatistics.overallAttendanceRate >= 90
                                  ? 'green'
                                  : attendanceStatistics.overallAttendanceRate >= 80
                                    ? 'blue'
                                    : 'yellow'
                              }
                            >
                              {attendanceStatistics.overallAttendanceRate >= 90
                                ? 'Excellent'
                                : attendanceStatistics.overallAttendanceRate >= 80
                                  ? 'Good'
                                  : 'Needs Improvement'}
                            </Badge>
                          </StatHelpText>
                        </Stat>
                      </SimpleGrid>

                      <Heading size="sm" mb={4}>
                        Monthly Attendance Trend
                      </Heading>
                      <Box
                        key="attendanceMonthlyTrend"
                        height={{ base: "250px", md: "400px" }}
                        minHeight="250px"
                        width="100%"
                        position="relative"
                        mb={4}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={monthlyAttendanceData}
                            margin={{
                              top: 5,
                              right: 20,
                              left: 0,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Area
                              type="monotone"
                              dataKey="rate"
                              stroke="#22c55e"
                              fill="#22c55e"
                              fillOpacity={0.3}
                              name="Attendance Rate %"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </Box>

                      <Heading size="sm" mb={4}>
                        Course Attendance Comparison
                      </Heading>
                      <Box
                        key="attendanceCourseComparison"
                        height={{ base: "250px", md: "400px" }}
                        minHeight="250px"
                        width="100%"
                        position="relative"
                        mb={4}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={attendanceStatistics.courseAttendance}
                            margin={{
                              top: 5,
                              right: 20,
                              left: 0,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="courseName" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="attendanceRate" fill="#0284c7" name="Attendance Rate %" />
                            <Bar dataKey="absenceCount" fill="#ef4444" name="Absences" />
                            <Bar dataKey="lateCount" fill="#eab308" name="Late Arrivals" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    </Box>
                  ) : (
                    <Text color="gray.500" textAlign="center" py={10}>
                      No attendance data available
                    </Text>
                  )}
                </CardBody>
              </Card>
            </AnimatedElement>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}
