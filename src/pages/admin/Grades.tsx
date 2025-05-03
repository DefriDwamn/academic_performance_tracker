"use client"

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
  Select,
  Text,
} from "@chakra-ui/react"
import { AddIcon, EditIcon } from "@chakra-ui/icons"
import { useGradesStore } from "../../store/gradesStore"
import { useStudentStore } from "../../store/studentStore"
import { DataTable } from "../../components/common/DataTable"
import { GradeForm } from "../../components/forms/GradeForm"
import { AnimatedElement } from "../../components/common/AnimatedElement"
import type { Grade } from "../../types/grade"

export default function AdminGrades() {
  const { grades, fetchGrades, addGrade, updateGrade, isLoading: gradesLoading } = useGradesStore()
  const { students, fetchStudents, isLoading: studentsLoading } = useStudentStore()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null)
  const [formMode, setFormMode] = useState<"add" | "edit">("add")
  const [selectedStudent, setSelectedStudent] = useState<string>("all")
  const [selectedCourse, setSelectedCourse] = useState<string>("all")
  const toast = useToast()

  const isLoading = gradesLoading || studentsLoading

  useEffect(() => {
    fetchGrades()
    fetchStudents()
  }, [fetchGrades, fetchStudents])

  const handleAddGrade = () => {
    setFormMode("add")
    setSelectedGrade(null)
    onOpen()
  }

  const handleEditGrade = (grade: Grade) => {
    setFormMode("edit")
    setSelectedGrade(grade)
    onOpen()
  }

  const handleFormSubmit = async (data: Omit<Grade, "id">) => {
    try {
      if (formMode === "add") {
        await addGrade(data)
        toast({
          title: "Grade added",
          description: "The grade has been successfully added.",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
      } else if (formMode === "edit" && selectedGrade) {
        await updateGrade(selectedGrade.id, data)
        toast({
          title: "Grade updated",
          description: "The grade has been successfully updated.",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
      }
      onClose()
    } catch (error) {
      toast({
        title: formMode === "add" ? "Add failed" : "Update failed",
        description: error instanceof Error ? error.message : `Failed to ${formMode} grade`,
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  // Extract unique students and courses for filtering
  const uniqueStudentIds = Array.from(new Set(grades.map((grade) => grade.studentId)))
  const uniqueCourseIds = Array.from(new Set(grades.map((grade) => grade.courseId)))

  // Get student name by ID
  const getStudentNameById = (studentId: string) => {
    const student = students.find((s) => s.id === studentId)
    return student ? `${student.firstName} ${student.lastName}` : studentId
  }

  // Filter grades based on selected filters
  const filteredGrades = grades.filter((grade) => {
    const studentMatch = selectedStudent === "all" || grade.studentId === selectedStudent
    const courseMatch = selectedCourse === "all" || grade.courseId === selectedCourse
    return studentMatch && courseMatch
  })

  // Define columns for the data table
  const columns = [
    {
      header: "Student",
      accessor: (grade: Grade) => getStudentNameById(grade.studentId),
    },
    {
      header: "Course",
      accessor: "courseName",
    },
    {
      header: "Semester",
      accessor: (grade: Grade) => `${grade.semester} ${grade.academicYear}`,
    },
    {
      header: "Grade",
      accessor: (grade: Grade) => (
        <HStack spacing={2}>
          <Text fontWeight="bold">{grade.grade}%</Text>
          <Badge
            colorScheme={
              grade.letterGrade === "A"
                ? "green"
                : grade.letterGrade === "B"
                  ? "blue"
                  : grade.letterGrade === "C"
                    ? "yellow"
                    : grade.letterGrade === "D"
                      ? "orange"
                      : "red"
            }
          >
            {grade.letterGrade}
          </Badge>
        </HStack>
      ),
    },
    {
      header: "Credits",
      accessor: "creditHours",
      isNumeric: true,
    },
    {
      header: "Submission Date",
      accessor: (grade: Grade) => new Date(grade.submissionDate).toLocaleDateString(),
    },
    {
      header: "Actions",
      accessor: (grade: Grade) => (
        <IconButton
          aria-label="Edit grade"
          icon={<EditIcon />}
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation()
            handleEditGrade(grade)
          }}
        />
      ),
    },
  ]

  // Mock data for form dropdowns
  const studentOptions = students.map((student) => ({
    id: student.id,
    name: `${student.firstName} ${student.lastName}`,
  }))

  const courseOptions = Array.from(new Set(grades.map((grade) => grade.courseId))).map((courseId) => {
    const course = grades.find((g) => g.courseId === courseId)
    return {
      id: courseId,
      name: course ? course.courseName : courseId,
    }
  })

  const instructorOptions = Array.from(new Set(grades.map((grade) => grade.instructorId))).map((instructorId) => {
    const grade = grades.find((g) => g.instructorId === instructorId)
    return {
      id: instructorId,
      name: grade ? grade.instructorName : instructorId,
    }
  })

  return (
    <Box>
      <AnimatedElement animation="fadeIn">
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg">Grades</Heading>
          <Button leftIcon={<AddIcon />} colorScheme="brand" onClick={handleAddGrade}>
            Add Grade
          </Button>
        </Flex>
      </AnimatedElement>

      <AnimatedElement animation="slideUp" delay={100}>
        <Flex mb={6} gap={4} direction={{ base: "column", md: "row" }}>
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
                const course = grades.find((g) => g.courseId === courseId)
                return (
                  <option key={courseId} value={courseId}>
                    {course ? course.courseName : courseId}
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
            <Heading size="md">Grade Management</Heading>
          </CardHeader>
          <CardBody>
            <DataTable
              columns={columns}
              data={filteredGrades}
              keyExtractor={(item) => item.id}
              isLoading={isLoading}
              searchable={true}
              sortable={true}
              pagination={true}
            />
          </CardBody>
        </Card>
      </AnimatedElement>

      {/* Add/Edit Grade Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{formMode === "add" ? "Add New Grade" : "Edit Grade"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <GradeForm
              initialData={selectedGrade || {}}
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              students={studentOptions}
              courses={courseOptions}
              instructors={instructorOptions}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}
