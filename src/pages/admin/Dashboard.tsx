"use client"

import { useEffect } from "react"
import {
  Box,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Text,
  SimpleGrid,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  HStack,
  VStack,
  Badge,
  Skeleton,
  Stack,
  Icon,
} from "@chakra-ui/react"
import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons"
import { Users, GraduationCap, BookOpen, Calendar } from "lucide-react"
import { useStudentStore } from "../../store/studentStore"
import { useGradesStore } from "../../store/gradesStore"
import { useAttendanceStore } from "../../store/attendanceStore"
import { useAnalyticsStore } from "../../store/analyticsStore"
import { AnimatedElement } from "../../components/common/AnimatedElement"
import {
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
} from "recharts"

export default function AdminDashboard() {
  const { students, fetchStudents, isLoading: studentsLoading } = useStudentStore()
  const { grades, fetchGrades, isLoading: gradesLoading } = useGradesStore()
  const { attendanceRecords, fetchAttendance, isLoading: attendanceLoading } = useAttendanceStore()
  const { performanceMetrics, fetchPerformanceMetrics, isLoading: analyticsLoading } = useAnalyticsStore()

  useEffect(() => {
    fetchStudents()
    fetchGrades()
    fetchAttendance()
    fetchPerformanceMetrics()
  }, [fetchStudents, fetchGrades, fetchAttendance, fetchPerformanceMetrics])

  const isLoading = studentsLoading || gradesLoading || attendanceLoading || analyticsLoading

  // Calculate statistics
  const activeStudents = students.filter((s) => s.status === "active").length
  const totalCourses = grades.length > 0 ? new Set(grades.map((g) => g.courseId)).size : 0
  const averageGPA = performanceMetrics?.overallGPA || 0
  const attendanceRate =
    attendanceRecords.length > 0
      ? (attendanceRecords.filter((r) => r.status === "present").length / attendanceRecords.length) * 100
      : 0

  // Prepare data for student status distribution
  const studentStatusData = [
    { name: "Active", value: students.filter((s) => s.status === "active").length },
    { name: "Inactive", value: students.filter((s) => s.status === "inactive").length },
    { name: "Graduated", value: students.filter((s) => s.status === "graduated").length },
    { name: "Suspended", value: students.filter((s) => s.status === "suspended").length },
  ].filter((item) => item.value > 0)

  // Prepare data for department distribution
  const departmentData = students.reduce(
    (acc, student) => {
      const dept = student.department
      const existingDept = acc.find((d) => d.name === dept)
      if (existingDept) {
        existingDept.value++
      } else {
        acc.push({ name: dept, value: 1 })
      }
      return acc
    },
    [] as { name: string; value: number }[],
  )

  // Prepare data for grade distribution
  const gradeDistributionData = grades.reduce(
    (acc, grade) => {
      const letterGrade = grade.letterGrade
      const existingGrade = acc.find((g) => g.name === letterGrade)
      if (existingGrade) {
        existingGrade.value++
      } else {
        acc.push({ name: letterGrade, value: 1 })
      }
      return acc
    },
    [] as { name: string; value: number }[],
  )

  // Colors for charts
  const COLORS = ["#0284c7", "#0ea5e9", "#38bdf8", "#7dd3fc", "#bae6fd"]
  const GRADE_COLORS = {
    A: "#22c55e",
    B: "#3b82f6",
    C: "#eab308",
    D: "#f97316",
    F: "#ef4444",
  }

  // Get recent students
  const recentStudents = [...students]
    .sort((a, b) => new Date(b.enrollmentDate).getTime() - new Date(a.enrollmentDate).getTime())
    .slice(0, 5)

  return (
    <Box>
      <AnimatedElement animation="fadeIn">
        <Heading size="lg" mb={6}>
          Administrator Dashboard
        </Heading>
      </AnimatedElement>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <AnimatedElement animation="slideUp" delay={100}>
          <Card>
            <CardBody>
              <Stat>
                <Flex align="center" mb={2}>
                  <Box
                    p={2}
                    bg="blue.50"
                    borderRadius="md"
                    color="blue.500"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mr={3}
                  >
                    <Icon as={Users} boxSize={5} />
                  </Box>
                  <StatLabel>Total Students</StatLabel>
                </Flex>
                <StatNumber>{isLoading ? <Skeleton height="36px" width="60px" /> : students.length}</StatNumber>
                <StatHelpText>
                  <HStack>
                    <ArrowUpIcon color="green.400" />
                    <Text color="green.400">4.6%</Text>
                    <Text>vs last semester</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </AnimatedElement>

        <AnimatedElement animation="slideUp" delay={200}>
          <Card>
            <CardBody>
              <Stat>
                <Flex align="center" mb={2}>
                  <Box
                    p={2}
                    bg="green.50"
                    borderRadius="md"
                    color="green.500"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mr={3}
                  >
                    <Icon as={GraduationCap} boxSize={5} />
                  </Box>
                  <StatLabel>Average GPA</StatLabel>
                </Flex>
                <StatNumber>{isLoading ? <Skeleton height="36px" width="60px" /> : averageGPA.toFixed(2)}</StatNumber>
                <StatHelpText>
                  <HStack>
                    <ArrowUpIcon color="green.400" />
                    <Text color="green.400">0.2</Text>
                    <Text>vs last semester</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </AnimatedElement>

        <AnimatedElement animation="slideUp" delay={300}>
          <Card>
            <CardBody>
              <Stat>
                <Flex align="center" mb={2}>
                  <Box
                    p={2}
                    bg="purple.50"
                    borderRadius="md"
                    color="purple.500"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mr={3}
                  >
                    <Icon as={BookOpen} boxSize={5} />
                  </Box>
                  <StatLabel>Active Courses</StatLabel>
                </Flex>
                <StatNumber>{isLoading ? <Skeleton height="36px" width="60px" /> : totalCourses}</StatNumber>
                <StatHelpText>
                  <HStack>
                    <ArrowUpIcon color="green.400" />
                    <Text color="green.400">2</Text>
                    <Text>new courses</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </AnimatedElement>

        <AnimatedElement animation="slideUp" delay={400}>
          <Card>
            <CardBody>
              <Stat>
                <Flex align="center" mb={2}>
                  <Box
                    p={2}
                    bg="orange.50"
                    borderRadius="md"
                    color="orange.500"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mr={3}
                  >
                    <Icon as={Calendar} boxSize={5} />
                  </Box>
                  <StatLabel>Attendance Rate</StatLabel>
                </Flex>
                <StatNumber>
                  {isLoading ? <Skeleton height="36px" width="60px" /> : `${attendanceRate.toFixed(1)}%`}
                </StatNumber>
                <StatHelpText>
                  <HStack>
                    <ArrowDownIcon color="red.400" />
                    <Text color="red.400">1.2%</Text>
                    <Text>vs last month</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </AnimatedElement>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
        <AnimatedElement animation="slideUp" delay={500}>
          <Card>
            <CardHeader>
              <Heading size="md">Student Status Distribution</Heading>
            </CardHeader>
            <CardBody>
              {isLoading ? (
                <Skeleton height="300px" />
              ) : (
                <Box height="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={studentStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {studentStatusData.map((entry) => (
                          <Cell key={entry.name} fill={COLORS[COLORS.indexOf(entry.name) % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardBody>
          </Card>
        </AnimatedElement>

        <AnimatedElement animation="slideUp" delay={600}>
          <Card>
            <CardHeader>
              <Heading size="md">Grade Distribution</Heading>
            </CardHeader>
            <CardBody>
              {isLoading ? (
                <Skeleton height="300px" />
              ) : (
                <Box height="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={gradeDistributionData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Students">
                        {gradeDistributionData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={
                              GRADE_COLORS[entry.name as keyof typeof GRADE_COLORS] || COLORS[index % COLORS.length]
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardBody>
          </Card>
        </AnimatedElement>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <AnimatedElement animation="slideUp" delay={700}>
          <Card>
            <CardHeader>
              <Heading size="md">Department Distribution</Heading>
            </CardHeader>
            <CardBody>
              {isLoading ? (
                <Skeleton height="300px" />
              ) : (
                <Box height="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={departmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name.replace(/_/g, " ")} ${(percent * 100).toFixed(0)}%`}
                      >
                        {departmentData.map((entry, index) => (
                          <Cell key={`dept-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardBody>
          </Card>
        </AnimatedElement>

        <AnimatedElement animation="slideUp" delay={800}>
          <Card>
            <CardHeader>
              <Heading size="md">Recently Enrolled Students</Heading>
            </CardHeader>
            <CardBody>
              {isLoading ? (
                <Stack spacing={4}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={`skeleton-${i}`} height="40px" />
                  ))}
                </Stack>
              ) : (
                <VStack spacing={4} align="stretch">
                  {recentStudents.map((student) => (
                    <Flex key={`student-${student.id}-${student.enrollmentDate}`} p={3} bg="gray.50" borderRadius="md" align="center">
                      <Box flex="1">
                        <Text fontWeight="medium">{`${student.firstName} ${student.lastName}`}</Text>
                        <Text fontSize="sm" color="gray.600">
                          {student.email}
                        </Text>
                      </Box>
                      <VStack align="flex-end" spacing={1}>
                        <Badge colorScheme="brand">{student.program}</Badge>
                        <Text fontSize="xs" color="gray.500">
                          Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}
                        </Text>
                      </VStack>
                    </Flex>
                  ))}
                </VStack>
              )}
            </CardBody>
          </Card>
        </AnimatedElement>
      </SimpleGrid>
    </Box>
  )
}
