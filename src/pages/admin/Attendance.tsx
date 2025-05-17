'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Button,
  HStack,
  Badge,
  Flex,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useToast,
  Select,
  Text,
  FormControl,
  FormLabel,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  RadioGroup,
  Radio,
} from '@chakra-ui/react'
import { AddIcon, EditIcon, AttachmentIcon } from '@chakra-ui/icons'
import { useAttendanceStore } from '../../store/attendanceStore'
import { useStudentStore } from '../../store/studentStore'
import { DataTable } from '../../components/common/DataTable'
import { AttendanceForm } from '../../components/forms/AttendanceForm'
import { AnimatedElement } from '../../components/common/AnimatedElement'
import type { Attendance } from '../../types/attendance'
import type { Student } from '../../types/student'
import { Modal as CustomModal } from '../../components/common/Modal'

export default function AdminAttendance() {
  const {
    attendanceRecords,
    fetchAttendance,
    bulkUploadAttendance,
    isLoading: attendanceLoading,
  } = useAttendanceStore()
  const { students, fetchStudents, isLoading: studentsLoading } = useStudentStore()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null)
  const [formMode, setFormMode] = useState<'add' | 'edit' | 'bulk'>('add')
  const [selectedStudent, setSelectedStudent] = useState<string>('all')
  const [selectedCourse, setSelectedCourse] = useState<string>('all')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [bulkStudents, setBulkStudents] = useState<Student[]>([])
  const [bulkCourseId, setBulkCourseId] = useState<string>('')
  const [bulkCourseName, setBulkCourseName] = useState<string>('')
  const [bulkAttendanceData, setBulkAttendanceData] = useState<
    Record<string, 'present' | 'absent' | 'late' | 'excused'>
  >({})
  const toast = useToast()

  const isLoading = attendanceLoading || studentsLoading

  useEffect(() => {
    fetchAttendance()
    fetchStudents()
  }, [fetchAttendance, fetchStudents])

  const handleAddAttendance = () => {
    setFormMode('add')
    setSelectedAttendance(null)
    onOpen()
  }

  const handleEditAttendance = (attendance: Attendance) => {
    setFormMode('edit')
    setSelectedAttendance(attendance)
    onOpen()
  }

  const handleBulkAttendance = () => {
    setFormMode('bulk')
    setBulkStudents(students.filter((s) => s.status === 'active'))
    onOpen()
  }

  const handleFormSubmit = async (data: Omit<Attendance, '_id'>) => {
    try {
      if (formMode === 'add') {
        await bulkUploadAttendance([data])
        toast({
          title: 'Attendance added',
          description: 'The attendance record has been successfully added.',
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
      } else if (formMode === 'edit' && selectedAttendance) {
        // For simplicity, we're using the bulk upload endpoint for updates as well
        const updatedRecord = { ...data, _id: selectedAttendance._id }
        await bulkUploadAttendance([updatedRecord as Omit<Attendance, '_id'>])
        toast({
          title: 'Attendance updated',
          description: 'The attendance record has been successfully updated.',
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
      }
      onClose()
    } catch (error) {
      toast({
        title: formMode === 'add' ? 'Add failed' : 'Update failed',
        description: error instanceof Error ? error.message : `Failed to ${formMode} attendance`,
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  const handleBulkSubmit = async () => {
    if (
      !bulkCourseId ||
      !bulkCourseName ||
      !selectedDate ||
      Object.keys(bulkAttendanceData).length === 0
    ) {
      toast({
        title: 'Validation error',
        description:
          'Please fill in all required fields and mark attendance for at least one student.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
      return
    }

    try {
      const records = Object.entries(bulkAttendanceData).map(([studentId, status]) => ({
        studentId,
        courseId: bulkCourseId,
        courseName: bulkCourseName,
        date: selectedDate,
        status,
        duration: 0, // Default duration
      }))

      await bulkUploadAttendance(records)
      toast({
        title: 'Attendance uploaded',
        description: `Attendance records for ${records.length} students have been successfully uploaded.`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
      onClose()
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload attendance records',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  // Extract unique students and courses for filtering
  const uniqueStudentIds = Array.from(new Set(attendanceRecords.map((record) => record.studentId)))
  const uniqueCourseIds = Array.from(new Set(attendanceRecords.map((record) => record.courseId)))

  // Get student name by ID
  const getStudentNameById = (studentId: string) => {
    const student = students.find((s) => s._id === studentId)
    return student ? `${student.firstName} ${student.lastName}` : studentId
  }

  // Filter attendance records based on selected filters
  const filteredRecords = attendanceRecords
    .filter((record) => {
      const studentMatch = selectedStudent === 'all' || record.studentId === selectedStudent
      const courseMatch = selectedCourse === 'all' || record.courseId === selectedCourse
      return studentMatch && courseMatch
    })
    .map((record) => ({
      ...record,
      studentName: getStudentNameById(record.studentId),
    }))

  // Define columns for the data table
  const columns = [
    {
      header: 'Date',
      accessor: (record: Attendance & { studentName: string }) =>
        new Date(record.date).toLocaleDateString(),
    },
    {
      header: 'Student',
      accessor: (record: Attendance & { studentName: string }) => record.studentName,
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
    {
      header: 'Actions',
      accessor: (record: Attendance) => (
        <IconButton
          aria-label="Edit attendance"
          icon={<EditIcon />}
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation()
            handleEditAttendance(record)
          }}
        />
      ),
    },
  ]

  // Mock data for form dropdowns
  const studentOptions = students.map((student) => ({
    id: student._id,
    name: `${student.firstName} ${student.lastName}`,
  }))

  const courseOptions = Array.from(new Set(attendanceRecords.map((record) => record.courseId))).map(
    (courseId) => {
      const record = attendanceRecords.find((r) => r.courseId === courseId)
      return {
        id: courseId,
        name: record ? record.courseName : courseId,
      }
    }
  )

  // Handle bulk attendance status change
  const handleStatusChange = (
    studentId: string,
    status: 'present' | 'absent' | 'late' | 'excused'
  ) => {
    setBulkAttendanceData((prev) => ({
      ...prev,
      [studentId]: status,
    }))
  }

  return (
    <Box>
      <AnimatedElement animation="fadeIn">
        <Flex 
          justify="space-between" 
          align="center" 
          mb={6}
          direction={{ base: 'column', md: 'row' }}
          gap={{ base: 4, md: 0 }}
        >
          <Heading size="lg">Attendance</Heading>
          <HStack spacing={4} w={{ base: 'full', md: 'auto' }}>
            <Button 
              leftIcon={<AddIcon />} 
              variant="outline" 
              onClick={handleAddAttendance}
              w={{ base: 'full', md: 'auto' }}
            >
              Add Single
            </Button>
            <Button
              leftIcon={<AttachmentIcon />}
              colorScheme="brand"
              onClick={handleBulkAttendance}
              w={{ base: 'full', md: 'auto' }}
            >
              Bulk Upload
            </Button>
          </HStack>
        </Flex>
      </AnimatedElement>

      <AnimatedElement animation="slideUp" delay={100}>
        <Flex mb={6} gap={4} direction={{ base: 'column', md: 'row' }}>
          <Box>
            <Text mb={2} fontWeight="medium">
              Filter by Student
            </Text>
            <Select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
              <option value="all">All Students</option>
              {uniqueStudentIds.map((studentId) => (
                <option key={studentId} value={studentId}>
                  {getStudentNameById(studentId)}
                </option>
              ))}
            </Select>
          </Box>
          <Box>
            <Text mb={2} fontWeight="medium">
              Filter by Course
            </Text>
            <Select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
              <option value="all">All Courses</option>
              {uniqueCourseIds.map((courseId) => {
                const record = attendanceRecords.find((r) => r.courseId === courseId)
                return (
                  <option key={courseId} value={courseId}>
                    {record ? record.courseName : courseId}
                  </option>
                )
              })}
            </Select>
          </Box>
        </Flex>
      </AnimatedElement>

      <AnimatedElement animation="slideUp" delay={200}>
        <Card>
          <CardHeader>
            <Heading size="md">Attendance Records</Heading>
          </CardHeader>
          <CardBody>
            <DataTable
              columns={columns}
              data={filteredRecords}
              keyExtractor={(item) => item._id}
              isLoading={isLoading}
              searchable={true}
              sortable={true}
              pagination={true}
            />
          </CardBody>
        </Card>
      </AnimatedElement>

      {/* Add/Edit/Bulk Attendance Modal */}
      <CustomModal
        isOpen={isOpen}
        onClose={onClose}
        title={
          formMode === 'add'
            ? 'Add Attendance Record'
            : formMode === 'edit'
              ? 'Edit Attendance Record'
              : 'Bulk Upload Attendance'
        }
        size={formMode === 'bulk' ? '4xl' : 'xl'}
      >
        {formMode === 'bulk' ? (
          <Box>
            <Flex gap={4} mb={6}>
              <FormControl isRequired>
                <FormLabel>Date</FormLabel>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Course</FormLabel>
                <Select
                  placeholder="Select course"
                  value={bulkCourseId}
                  onChange={(e) => {
                    setBulkCourseId(e.target.value)
                    const course = courseOptions.find((c) => c.id === e.target.value)
                    if (course) {
                      setBulkCourseName(course.name)
                    }
                  }}
                >
                  {courseOptions.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Flex>

            <Box maxH="400px" overflowY="auto">
              <Table variant="simple">
                <Thead position="sticky" top={0} bg="white" zIndex={1}>
                  <Tr>
                    <Th>Student</Th>
                    <Th>Present</Th>
                    <Th>Absent</Th>
                    <Th>Late</Th>
                    <Th>Excused</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {bulkStudents.map((student) => (
                    <Tr key={student._id}>
                      <Td>{`${student.firstName} ${student.lastName}`}</Td>
                      <Td>
                        <RadioGroup
                          value={bulkAttendanceData[student._id] || ''}
                          onChange={(value) =>
                            handleStatusChange(
                              student._id,
                              value as 'present' | 'absent' | 'late' | 'excused'
                            )
                          }
                        >
                          <HStack spacing={4}>
                            <Radio
                              value="present"
                              isChecked={bulkAttendanceData[student._id] === 'present'}
                            >
                              Present
                            </Radio>
                            <Radio
                              value="absent"
                              isChecked={bulkAttendanceData[student._id] === 'absent'}
                            >
                              Absent
                            </Radio>
                            <Radio
                              value="late"
                              isChecked={bulkAttendanceData[student._id] === 'late'}
                            >
                              Late
                            </Radio>
                            <Radio
                              value="excused"
                              isChecked={bulkAttendanceData[student._id] === 'excused'}
                            >
                              Excused
                            </Radio>
                          </HStack>
                        </RadioGroup>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>

            <Flex justify="flex-end" mt={6}>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="brand" onClick={handleBulkSubmit} isLoading={isLoading}>
                Upload Attendance
              </Button>
            </Flex>
          </Box>
        ) : (
          <AttendanceForm
            initialData={selectedAttendance || {}}
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
            students={studentOptions}
            courses={courseOptions}
          />
        )}
      </CustomModal>
    </Box>
  )
}
