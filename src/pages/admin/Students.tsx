"use client"

import React from "react"

import { useEffect, useState } from "react"
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
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  SimpleGrid,
  VStack,
  Text,
} from "@chakra-ui/react"
import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons"
import { useStudentStore } from "../../store/studentStore"
import { DataTable } from "../../components/common/DataTable"
import { StudentForm } from "../../components/forms/StudentForm"
import { AnimatedElement } from "../../components/common/AnimatedElement"
import type { Student } from "../../types/student"

export default function AdminStudents() {
  const { students, fetchStudents, createStudent, updateStudent, deleteStudent, isLoading } = useStudentStore()
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure()
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure()
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [formMode, setFormMode] = useState<"add" | "edit">("add")
  const toast = useToast()
  const cancelRef = React.useRef<HTMLButtonElement>(null)

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  const handleAddStudent = () => {
    setFormMode("add")
    setSelectedStudent(null)
    onFormOpen()
  }

  const handleEditStudent = (student: Student) => {
    setFormMode("edit")
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
      await deleteStudent(selectedStudent.id)
      toast({
        title: "Student deleted",
        description: "The student has been successfully deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      onDeleteClose()
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Failed to delete student",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleFormSubmit = async (data: Omit<Student, "id">) => {
    try {
      if (formMode === "add") {
        await createStudent(data)
        toast({
          title: "Student added",
          description: "The student has been successfully added.",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
      } else if (formMode === "edit" && selectedStudent) {
        await updateStudent(selectedStudent.id, data)
        toast({
          title: "Student updated",
          description: "The student has been successfully updated.",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
      }
      onFormClose()
    } catch (error) {
      toast({
        title: formMode === "add" ? "Add failed" : "Update failed",
        description: error instanceof Error ? error.message : `Failed to ${formMode} student`,
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  // Define columns for the data table
  const columns = [
    {
      header: "Name",
      accessor: (student: Student) => `${student.firstName} ${student.lastName}`,
    },
    {
      header: "Student ID",
      accessor: "studentId",
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Program",
      accessor: (student: Student) => (
        <Badge colorScheme="brand" textTransform="capitalize">
          {student.program}
        </Badge>
      ),
    },
    {
      header: "Department",
      accessor: (student: Student) => (
        <Badge variant="outline" textTransform="capitalize">
          {student.department.replace(/_/g, " ")}
        </Badge>
      ),
    },
    {
      header: "Status",
      accessor: (student: Student) => (
        <Badge
          colorScheme={
            student.status === "active"
              ? "green"
              : student.status === "graduated"
                ? "blue"
                : student.status === "suspended"
                  ? "red"
                  : "gray"
          }
        >
          {student.status}
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessor: (student: Student) => (
        <HStack spacing={2}>
          <IconButton
            aria-label="View student"
            icon={<ViewIcon />}
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              handleViewStudent(student)
            }}
          />
          <IconButton
            aria-label="Edit student"
            icon={<EditIcon />}
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              handleEditStudent(student)
            }}
          />
          <IconButton
            aria-label="Delete student"
            icon={<DeleteIcon />}
            size="sm"
            variant="ghost"
            colorScheme="red"
            onClick={(e) => {
              e.stopPropagation()
              handleDeleteClick(student)
            }}
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
              keyExtractor={(item) => item.id}
              isLoading={isLoading}
              onRowClick={handleViewStudent}
              searchable={true}
              sortable={true}
              pagination={true}
            />
          </CardBody>
        </Card>
      </AnimatedElement>

      {/* Add/Edit Student Modal */}
      <Modal isOpen={isFormOpen} onClose={onFormClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{formMode === "add" ? "Add New Student" : "Edit Student"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <StudentForm initialData={selectedStudent || {}} onSubmit={handleFormSubmit} isLoading={isLoading} />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* View Student Modal */}
      {selectedStudent && (
        <Modal isOpen={isViewOpen} onClose={onViewClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Student Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Box mb={4}>
                <Heading size="md">{`${selectedStudent.firstName} ${selectedStudent.lastName}`}</Heading>
                <Badge
                  colorScheme={
                    selectedStudent.status === "active"
                      ? "green"
                      : selectedStudent.status === "graduated"
                        ? "blue"
                        : selectedStudent.status === "suspended"
                          ? "red"
                          : "gray"
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
                      <Text textTransform="capitalize">{selectedStudent.department.replace(/_/g, " ")}</Text>
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
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelRef} onClose={onDeleteClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Student
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete{" "}
              {selectedStudent ? `${selectedStudent.firstName} ${selectedStudent.lastName}` : "this student"}? This
              action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3} isLoading={isLoading}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  )
}
