'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Text,
  Select,
  HStack,
  Badge,
  Flex,
  Skeleton,
  Stack,
  Progress,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react'
import { CalendarIcon } from '@chakra-ui/icons'
import { useAttendanceStore } from '../../store/attendanceStore'
import { DataTable } from '../../components/common/DataTable'
import { AnimatedElement } from '../../components/common/AnimatedElement'
import type { Attendance } from '../../types/attendance'

export default function StudentAttendance() {
  const { attendanceRecords, fetchAttendance, isLoading } = useAttendanceStore()
  const [selectedCourse, setSelectedCourse] = useState<string>('all')
  const [selectedMonth, setSelectedMonth] = useState<string>('all')

  useEffect(() => {
    fetchAttendance()
  }, [fetchAttendance])

  // Extract unique courses and months for filtering
  const courses = Array.from(new Set(attendanceRecords.map((record) => record.courseId)))
  const courseNames = Array.from(new Set(attendanceRecords.map((record) => record.courseName)))

  // Get course name by ID
  const getCourseNameById = (courseId: string) => {
    const record = attendanceRecords.find((r) => r.courseId === courseId)
    return record ? record.courseName : courseId
  }

  // Filter attendance records based on selected filters
  const filteredRecords = attendanceRecords.filter((record) => {
    const courseMatch = selectedCourse === 'all' || record.courseId === selectedCourse
    const monthMatch =
      selectedMonth === 'all' ||
      new Date(record.date).getMonth() === Number.parseInt(selectedMonth, 10)
    return courseMatch && monthMatch
  })

  // Calculate attendance statistics
  const calculateAttendanceStats = (records: Attendance[]) => {
    if (records.length === 0) return { present: 0, absent: 0, late: 0, excused: 0, rate: 0 }

    const present = records.filter((r) => r.status === 'present').length
    const absent = records.filter((r) => r.status === 'absent').length
    const late = records.filter((r) => r.status === 'late').length
    const excused = records.filter((r) => r.status === 'excused').length
    const rate = ((present + late) / records.length) * 100

    return { present, absent, late, excused, rate }
  }

  const stats = calculateAttendanceStats(filteredRecords)

  // Calculate course-specific attendance rates
  const courseStats = courses.map((courseId) => {
    const courseRecords = attendanceRecords.filter((r) => r.courseId === courseId)
    const { rate } = calculateAttendanceStats(courseRecords)
    return {
      courseId,
      courseName: getCourseNameById(courseId),
      rate,
      count: courseRecords.length,
    }
  })

  // Define columns for the data table
  const columns = [
    {
      header: 'Date',
      accessor: (record: Attendance) => new Date(record.date).toLocaleDateString(),
    },
    {
      header: 'Course',
      accessor: (record: Attendance) => record.courseName,
    },
    {
      header: 'Status',
      accessor: (record: Attendance) => (
        <Badge
          colorScheme={
            record.status === 'present'
              ? 'green'
              : record.status === 'late'
                ? 'yellow'
                : record.status === 'excused'
                  ? 'blue'
                  : 'red'
          }
        >
          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
        </Badge>
      ),
    },
    {
      header: 'Duration',
      accessor: (record: Attendance) => (record.duration ? `${record.duration} min` : 'N/A'),
    },
    {
      header: 'Notes',
      accessor: (record: Attendance) => record.notes || '—',
    },
  ]

  return (
    <Box>
      <AnimatedElement animation="fadeIn">
        <Heading size="lg" mb={6}>
          My Attendance
        </Heading>
      </AnimatedElement>

      <AnimatedElement animation="slideUp" delay={100}>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={6}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Attendance Rate</StatLabel>
                <Flex align="center" mt={2}>
                  <CircularProgress
                    value={stats.rate}
                    color="green.400"
                    size="60px"
                    thickness="8px"
                  >
                    <CircularProgressLabel>{stats.rate.toFixed(0)}%</CircularProgressLabel>
                  </CircularProgress>
                  <Box ml={4}>
                    <StatNumber>{stats.rate.toFixed(1)}%</StatNumber>
                    <StatHelpText>Overall</StatHelpText>
                  </Box>
                </Flex>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Present</StatLabel>
                <StatNumber>
                  {isLoading ? <Skeleton height="24px" width="40px" /> : stats.present}
                </StatNumber>
                <StatHelpText>Days</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Absent</StatLabel>
                <StatNumber>
                  {isLoading ? <Skeleton height="24px" width="40px" /> : stats.absent}
                </StatNumber>
                <StatHelpText>Days</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Late</StatLabel>
                <StatNumber>
                  {isLoading ? <Skeleton height="24px" width="40px" /> : stats.late}
                </StatNumber>
                <StatHelpText>Days</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>
      </AnimatedElement>

      <AnimatedElement animation="slideUp" delay={200}>
        <Flex mb={6} gap={4} direction={{ base: 'column', md: 'row' }}>
          <Box>
            <Text mb={2} fontWeight="medium">
              Filter by Course
            </Text>
            <Select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
              <option value="all">All Courses</option>
              {courses.map((courseId, index) => (
                <option key={courseId} value={courseId}>
                  {courseNames[index]}
                </option>
              ))}
            </Select>
          </Box>
          <Box>
            <Text mb={2} fontWeight="medium">
              Filter by Month
            </Text>
            <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
              <option value="all">All Months</option>
              <option value="0">January</option>
              <option value="1">February</option>
              <option value="2">March</option>
              <option value="3">April</option>
              <option value="4">May</option>
              <option value="5">June</option>
              <option value="6">July</option>
              <option value="7">August</option>
              <option value="8">September</option>
              <option value="9">October</option>
              <option value="10">November</option>
              <option value="11">December</option>
            </Select>
          </Box>
        </Flex>
      </AnimatedElement>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={6}>
        <AnimatedElement animation="slideUp" delay={300}>
          <Card>
            <CardHeader>
              <Heading size="md">Course Attendance</Heading>
            </CardHeader>
            <CardBody>
              {isLoading ? (
                <Stack spacing={4}>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} height="40px" />
                  ))}
                </Stack>
              ) : courseStats.length > 0 ? (
                <Stack spacing={4}>
                  {courseStats.map((course) => (
                    <Box key={course.courseId}>
                      <Flex justify="space-between" mb={1}>
                        <Text fontWeight="medium">{course.courseName}</Text>
                        <HStack>
                          <Text fontWeight="bold">{course.rate.toFixed(1)}%</Text>
                          <Text fontSize="sm" color="gray.500">
                            ({course.count} classes)
                          </Text>
                        </HStack>
                      </Flex>
                      <Progress
                        value={course.rate}
                        colorScheme={
                          course.rate >= 90 ? 'green' : course.rate >= 75 ? 'blue' : 'red'
                        }
                        borderRadius="full"
                        size="sm"
                      />
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Text color="gray.500">No course attendance data available</Text>
              )}
            </CardBody>
          </Card>
        </AnimatedElement>

        <AnimatedElement animation="slideUp" delay={400}>
          <Card>
            <CardHeader>
              <Heading size="md">Recent Attendance</Heading>
            </CardHeader>
            <CardBody>
              {isLoading ? (
                <Stack spacing={4}>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} height="40px" />
                  ))}
                </Stack>
              ) : filteredRecords.length > 0 ? (
                <Stack spacing={3}>
                  {filteredRecords
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 5)
                    .map((record) => {
                      const uniqueKey = `${record.courseName}-${record.date}-${record.status}`
                      return (
                        <Flex key={uniqueKey} p={3} bg="gray.50" borderRadius="md" align="center">
                          <Box
                            bg={
                              record.status === 'present'
                                ? 'green.100'
                                : record.status === 'late'
                                  ? 'yellow.100'
                                  : record.status === 'excused'
                                    ? 'blue.100'
                                    : 'red.100'
                            }
                            color={
                              record.status === 'present'
                                ? 'green.700'
                                : record.status === 'late'
                                  ? 'yellow.700'
                                  : record.status === 'excused'
                                    ? 'blue.700'
                                    : 'red.700'
                            }
                            p={2}
                            borderRadius="md"
                            mr={4}
                          >
                            <CalendarIcon />
                          </Box>
                          <Box flex="1">
                            <Text fontWeight="medium">{record.courseName}</Text>
                            <Text fontSize="sm" color="gray.600">
                              {new Date(record.date).toLocaleDateString()}
                            </Text>
                          </Box>
                          <Badge
                            colorScheme={
                              record.status === 'present'
                                ? 'green'
                                : record.status === 'late'
                                  ? 'yellow'
                                  : record.status === 'excused'
                                    ? 'blue'
                                    : 'red'
                            }
                          >
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </Badge>
                        </Flex>
                      )
                    })}
                </Stack>
              ) : (
                <Text color="gray.500">No attendance records available</Text>
              )}
            </CardBody>
          </Card>
        </AnimatedElement>
      </SimpleGrid>

      <AnimatedElement animation="slideUp" delay={500}>
        <Card>
          <CardHeader>
            <Heading size="md">Attendance History</Heading>
          </CardHeader>
          <CardBody>
            <DataTable
              columns={columns}
              data={filteredRecords}
              keyExtractor={(item) => `${item.studentId}-${item.courseId}-${item.date}`}
              isLoading={isLoading}
              searchable={true}
              sortable={true}
              pagination={true}
            />
          </CardBody>
        </Card>
      </AnimatedElement>
    </Box>
  )
}
