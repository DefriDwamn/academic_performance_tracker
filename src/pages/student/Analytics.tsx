'use client'

import { useEffect } from 'react'
import {
  Box,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Text,
  SimpleGrid,
  Skeleton,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
} from '@chakra-ui/react'
import { useAnalyticsStore } from '../../store/analyticsStore'
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

export default function StudentAnalytics() {
  const {
    performanceMetrics,
    attendanceStatistics,
    fetchPerformanceMetrics,
    fetchAttendanceStatistics,
    isLoading,
  } = useAnalyticsStore()

  useEffect(() => {
    fetchPerformanceMetrics()
    fetchAttendanceStatistics()
  }, [fetchPerformanceMetrics, fetchAttendanceStatistics])

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

  const gradeDistributionData = prepareGradeDistributionData()
  const gpaTrendData = prepareGPATrendData()
  const coursePerformanceData = prepareCoursePerformanceData()
  const monthlyAttendanceData = prepareMonthlyAttendanceData()

  return (
    <Box>
      <AnimatedElement animation="fadeIn">
        <Heading size="lg" mb={6}>
          My Analytics
        </Heading>
      </AnimatedElement>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
        <AnimatedElement animation="slideUp" delay={100}>
          <Card>
            <CardHeader>
              <Heading size="md">Academic Performance</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                <Stat>
                  <StatLabel>Current GPA</StatLabel>
                  <StatNumber>
                    {isLoading ? (
                      <Skeleton height="36px" width="80px" />
                    ) : (
                      (performanceMetrics?.overallGPA || 0).toFixed(2)
                    )}
                  </StatNumber>
                  <StatHelpText>Out of 4.0</StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel>Attendance Rate</StatLabel>
                  <StatNumber>
                    {isLoading ? (
                      <Skeleton height="36px" width="80px" />
                    ) : (
                      `${(attendanceStatistics?.overallAttendanceRate || 0).toFixed(1)}%`
                    )}
                  </StatNumber>
                  <StatHelpText>Overall</StatHelpText>
                </Stat>
              </SimpleGrid>

              <Divider my={4} />

              <Text fontWeight="medium" mb={2}>
                Grade Distribution
              </Text>
              {isLoading ? (
                <Skeleton height="250px" />
              ) : (
                <Box height="250px">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 0, right: 0, bottom: 20, left: 0 }}>
                      <Pie
                        data={gradeDistributionData}
                        cx="50%"
                        cy="45%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
                      <Tooltip />
                      <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                    </PieChart>
                  </ResponsiveContainer>
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
                <Skeleton height="300px" />
              ) : (
                <Box height="300px">
                  <ResponsiveContainer width="100%" height="100%">
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
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="gpa" stroke="#0284c7" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
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
                <Skeleton height="300px" />
              ) : (
                <Box height="300px">
                  <ResponsiveContainer width="100%" height="100%">
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
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="average" fill="#0284c7" name="Average" />
                      <Bar dataKey="highest" fill="#22c55e" name="Highest" />
                      <Bar dataKey="lowest" fill="#ef4444" name="Lowest" />
                    </BarChart>
                  </ResponsiveContainer>
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
                <Skeleton height="300px" />
              ) : (
                <Box height="300px">
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
              )}
            </CardBody>
          </Card>
        </AnimatedElement>
      </SimpleGrid>
    </Box>
  )
}
