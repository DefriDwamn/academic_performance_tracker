"use client"

import { useEffect } from "react"
import {
  Box,
  Grid,
  Heading,
  Text,
  Stat,
  StatNumber,
  StatHelpText,
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
  Progress,
  HStack,
  VStack,
  Flex,
  Skeleton,
} from "@chakra-ui/react"
import { useAuthStore } from "../../store/authStore"
import { useGradesStore } from "../../store/gradesStore"
import { useAttendanceStore } from "../../store/attendanceStore"
import { useAnalyticsStore } from "../../store/analyticsStore"
import { AnimatedElement } from "../../components/common/AnimatedElement"

export default function StudentDashboard() {
  const { user } = useAuthStore()
  const { grades, fetchGrades, isLoading: gradesLoading } = useGradesStore()
  const { attendanceRecords, fetchAttendance, isLoading: attendanceLoading } = useAttendanceStore()
  const { performanceMetrics, fetchPerformanceMetrics, isLoading: analyticsLoading } = useAnalyticsStore()

  useEffect(() => {
    fetchGrades()
    fetchAttendance()
    fetchPerformanceMetrics()
  }, [fetchGrades, fetchAttendance, fetchPerformanceMetrics])

  const isLoading = gradesLoading || attendanceLoading || analyticsLoading

  // Calculate attendance rate
  const attendanceRate =
    attendanceRecords.length > 0
      ? (attendanceRecords.filter((record) => record.status === "present").length / attendanceRecords.length) * 100
      : 0

  // Get recent grades
  const recentGrades = [...grades]
    .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime())
    .slice(0, 5)

  return (
    <Box>
      <AnimatedElement animation="fadeIn">
        <Heading size="lg" mb={6}>
          Welcome back, {user?.name}
        </Heading>
      </AnimatedElement>

      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6} mb={8}>
        <AnimatedElement animation="slideUp" delay={100}>
          <Card>
            <CardHeader pb={0}>
              <Heading size="sm">Current GPA</Heading>
            </CardHeader>
            <CardBody>
              <Stat>
                <StatNumber fontSize="3xl">
                  {isLoading ? (
                    <Skeleton height="36px" width="80px" />
                  ) : (
                    performanceMetrics?.overallGPA.toFixed(2) || "N/A"
                  )}
                </StatNumber>
                <StatHelpText>Out of 4.0</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </AnimatedElement>

        <AnimatedElement animation="slideUp" delay={200}>
          <Card>
            <CardHeader pb={0}>
              <Heading size="sm">Attendance Rate</Heading>
            </CardHeader>
            <CardBody>
              <Stat>
                <StatNumber fontSize="3xl">
                  {isLoading ? <Skeleton height="36px" width="80px" /> : `${attendanceRate.toFixed(0)}%`}
                </StatNumber>
                <StatHelpText>Overall attendance</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </AnimatedElement>

        <AnimatedElement animation="slideUp" delay={300}>
          <Card>
            <CardHeader pb={0}>
              <Heading size="sm">Courses</Heading>
            </CardHeader>
            <CardBody>
              <Stat>
                <StatNumber fontSize="3xl">
                  {isLoading ? <Skeleton height="36px" width="80px" /> : new Set(grades.map((g) => g.courseId)).size}
                </StatNumber>
                <StatHelpText>Enrolled courses</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </AnimatedElement>
      </Grid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
        <AnimatedElement animation="slideUp" delay={400}>
          <Card>
            <CardHeader>
              <Heading size="md">Recent Grades</Heading>
            </CardHeader>
            <CardBody>
              {isLoading ? (
                <VStack spacing={4} align="stretch">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} height="60px" />
                  ))}
                </VStack>
              ) : recentGrades.length > 0 ? (
                <VStack spacing={4} align="stretch">
                  {recentGrades.map((grade) => (
                    <Box key={grade.id} p={3} borderRadius="md" bg="gray.50">
                      <Flex justify="space-between" align="center">
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">{grade.courseName}</Text>
                          <Text fontSize="sm" color="gray.600">
                            {new Date(grade.submissionDate).toLocaleDateString()}
                          </Text>
                        </VStack>
                        <HStack>
                          <Text fontWeight="bold" fontSize="lg">
                            {grade.grade}%
                          </Text>
                          <Text
                            fontWeight="bold"
                            color={
                              grade.letterGrade === "A"
                                ? "green.500"
                                : grade.letterGrade === "B"
                                  ? "blue.500"
                                  : grade.letterGrade === "C"
                                    ? "yellow.500"
                                    : grade.letterGrade === "D"
                                      ? "orange.500"
                                      : "red.500"
                            }
                          >
                            {grade.letterGrade}
                          </Text>
                        </HStack>
                      </Flex>
                    </Box>
                  ))}
                </VStack>
              ) : (
                <Text color="gray.500">No grades available</Text>
              )}
            </CardBody>
          </Card>
        </AnimatedElement>

        <AnimatedElement animation="slideUp" delay={500}>
          <Card>
            <CardHeader>
              <Heading size="md">Course Performance</Heading>
            </CardHeader>
            <CardBody>
              {isLoading ? (
                <VStack spacing={6} align="stretch">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} height="60px" />
                  ))}
                </VStack>
              ) : performanceMetrics?.coursePerformance ? (
                <VStack spacing={6} align="stretch">
                  {performanceMetrics.coursePerformance.map((course) => (
                    <Box key={course.courseId}>
                      <Flex justify="space-between" mb={1}>
                        <Text fontWeight="medium">{course.courseName}</Text>
                        <Text fontWeight="bold">{course.averageGrade.toFixed(1)}%</Text>
                      </Flex>
                      <Progress
                        value={course.averageGrade}
                        colorScheme={
                          course.averageGrade >= 90
                            ? "green"
                            : course.averageGrade >= 80
                              ? "blue"
                              : course.averageGrade >= 70
                                ? "yellow"
                                : course.averageGrade >= 60
                                  ? "orange"
                                  : "red"
                        }
                        borderRadius="full"
                        size="sm"
                      />
                      <Flex justify="space-between" mt={1}>
                        <Text fontSize="xs" color="gray.500">
                          Class Avg: {course.averageGrade.toFixed(1)}%
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          Highest: {course.highestGrade.toFixed(1)}%
                        </Text>
                      </Flex>
                    </Box>
                  ))}
                </VStack>
              ) : (
                <Text color="gray.500">No course performance data available</Text>
              )}
            </CardBody>
          </Card>
        </AnimatedElement>
      </SimpleGrid>
    </Box>
  )
}
