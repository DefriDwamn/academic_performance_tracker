'use client'

import React from 'react'

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
  useToast,
  SimpleGrid,
  VStack,
  Text,
} from '@chakra-ui/react'
import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons'
import { useStudentStore } from '../../store/studentStore'
import { DataTable } from '../../components/common/DataTable'
import { StudentForm, StudentFormData } from '../../components/forms/StudentForm'
import { AnimatedElement } from '../../components/common/AnimatedElement'
import type { Student } from '../../types/student'
import { Modal as CustomModal } from '../../components/common/Modal'

export default function AdminStudents() {
  const { students, fetchStudents, createStudent, updateStudent, deleteStudent, isLoading } =
    useStudentStore()
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure()
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure()
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add')
  const toast = useToast()

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  const handleAddStudent = () => {
    setFormMode('add')
    setSelectedStudent(null)
    onFormOpen()
  }

  const handleEditStudent = (student: Student) => {
    setFormMode('edit')
    setSelectedStudent(student)
    onFormOpen()
  }

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student)
    onViewOpen()
  }

  const handleDeleteClick = (student: Student) => {
    setSelectedStudent(student)
    onDeleteOpen()
  }

  const handleDeleteConfirm = async () => {
    if (!selectedStudent) return

    try {
      await deleteStudent(selectedStudent._id)
      toast({
        title: 'Student deleted',
        description: 'The student has been successfully deleted.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
      onDeleteClose()
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: error instanceof Error ? error.message : 'Failed to delete student',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  const handleFormSubmit = async (data: StudentFormData) => {
    try {
      if (formMode === 'add') {
        await createStudent(data)
        toast({
          title: 'Student added',
          description: 'The student has been successfully added.',
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
      } else if (formMode === 'edit' && selectedStudent) {
        await updateStudent(selectedStudent._id, data)
        toast({
          title: 'Student updated',
          description: 'The student has been successfully updated.',
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
      }
      onFormClose()
    } catch (error) {
      toast({
        title: formMode === 'add' ? 'Add failed' : 'Update failed',
        description: error instanceof Error ? error.message : `Failed to ${formMode} student`,
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  // Define columns for the data table
  const columns = [
    {
      header: 'Name',
      accessor: (student: Student) => `${student.firstName} ${student.lastName}`,
    },
    {
      header: 'Student ID',
      accessor: (student: Student) => student.studentId,
    },
    {
      header: 'Email',
      accessor: (student: Student) => student.email,
    },
    {
      header: 'Department',
      accessor: (student: Student) => student.department,
    },
    {
      header: 'Program',
      accessor: (student: Student) => student.program,
    },
    {
      header: 'Status',
      accessor: (student: Student) => (
        <Badge
          colorScheme={
            student.status === 'active'
              ? 'green'
              : student.status === 'inactive'
                ? 'gray'
                : student.status === 'graduated'
                  ? 'blue'
                  : 'red'
          }
        >
          {student.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessor: (student: Student) => (
        <HStack spacing={2}>
          <IconButton
            aria-label="View student"
            icon={<ViewIcon />}
            size="sm"
            onClick={() => handleViewStudent(student)}
          />
          <IconButton
            aria-label="Edit student"
            icon={<EditIcon />}
            size="sm"
            onClick={() => handleEditStudent(student)}
          />
          <IconButton
            aria-label="Delete student"
            icon={<DeleteIcon />}
            size="sm"
            colorScheme="red"
            onClick={() => handleDeleteClick(student)}
          />
        </HStack>
      ),
    },
  ]

  return (
    <Box>
      <AnimatedElement animation="fadeIn">
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg">Students</Heading>
          <Button leftIcon={<AddIcon />} colorScheme="brand" onClick={handleAddStudent}>
            Add Student
          </Button>
        </Flex>
      </AnimatedElement>

      <AnimatedElement animation="slideUp" delay={100}>
        <Card>
          <CardHeader>
            <Heading size="md">Student Management</Heading>
          </CardHeader>
          <CardBody>
            <DataTable
              columns={columns}
              data={students}
              keyExtractor={(item) => item._id}
              isLoading={isLoading}
              searchable={true}
              sortable={true}
              pagination={true}
            />
          </CardBody>
        </Card>
      </AnimatedElement>

      {/* Add/Edit Student Modal */}
      <CustomModal
        isOpen={isFormOpen}
        onClose={onFormClose}
        title={formMode === 'add' ? 'Add New Student' : 'Edit Student'}
      >
        <StudentForm
          initialData={selectedStudent || {}}
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
        />
      </CustomModal>

      {/* View Student Modal */}
      {selectedStudent && (
        <CustomModal
          isOpen={isViewOpen}
          onClose={onViewClose}
          title="Student Details"
          size="lg"
        >
          <Box mb={4}>
            <Heading size="md">{`${selectedStudent.firstName} ${selectedStudent.lastName}`}</Heading>
            <Badge
              colorScheme={
                selectedStudent.status === 'active'
                  ? 'green'
                  : selectedStudent.status === 'graduated'
                    ? 'blue'
                    : selectedStudent.status === 'suspended'
                      ? 'red'
                      : 'gray'
              }
              mt={2}
            >
              {selectedStudent.status}
            </Badge>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
            <Box>
              <Heading size="xs" textTransform="uppercase" color="gray.500" mb={2}>
                Personal Information
              </Heading>
              <VStack align="start" spacing={2}>
                <HStack>
                  <Text fontWeight="bold">Student ID:</Text>
                  <Text>{selectedStudent.studentId}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Email:</Text>
                  <Text>{selectedStudent.email}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Date of Birth:</Text>
                  <Text>{new Date(selectedStudent.dateOfBirth).toLocaleDateString()}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Gender:</Text>
                  <Text textTransform="capitalize">{selectedStudent.gender}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Phone:</Text>
                  <Text>{selectedStudent.phoneNumber}</Text>
                </HStack>
                <HStack alignItems="flex-start">
                  <Text fontWeight="bold">Address:</Text>
                  <Text>{selectedStudent.address}</Text>
                </HStack>
              </VStack>
            </Box>

            <Box>
              <Heading size="xs" textTransform="uppercase" color="gray.500" mb={2}>
                Academic Information
              </Heading>
              <VStack align="start" spacing={2}>
                <HStack>
                  <Text fontWeight="bold">Department:</Text>
                  <Text textTransform="capitalize">
                    {selectedStudent.department.replace(/_/g, ' ')}
                  </Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Program:</Text>
                  <Text textTransform="capitalize">{selectedStudent.program}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Enrollment Date:</Text>
                  <Text>{new Date(selectedStudent.enrollmentDate).toLocaleDateString()}</Text>
                </HStack>
                {selectedStudent.graduationDate && (
                  <HStack>
                    <Text fontWeight="bold">Expected Graduation:</Text>
                    <Text>{new Date(selectedStudent.graduationDate).toLocaleDateString()}</Text>
                  </HStack>
                )}
              </VStack>
            </Box>
          </SimpleGrid>

          <HStack spacing={4} mt={6}>
            <Button onClick={onViewClose}>Close</Button>
            <Button
              colorScheme="brand"
              onClick={() => {
                onViewClose()
                handleEditStudent(selectedStudent)
              }}
            >
              Edit
            </Button>
          </HStack>
        </CustomModal>
      )}

      {/* Delete Confirmation Dialog */}
      <CustomModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        title="Delete Student"
      >
        <Box>
          <Text mb={4}>
            Are you sure you want to delete{' '}
            {selectedStudent
              ? `${selectedStudent.firstName} ${selectedStudent.lastName}`
              : 'this student'}
            ? This action cannot be undone.
          </Text>

          <HStack spacing={4} justify="flex-end">
            <Button onClick={onDeleteClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDeleteConfirm}
              isLoading={isLoading}
            >
              Delete
            </Button>
          </HStack>
        </Box>
      </CustomModal>
    </Box>
  )
}
