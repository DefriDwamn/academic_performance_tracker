"use client"

import { useEffect, useState } from "react"
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
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react"
import { useGradesStore } from "../../store/gradesStore"
import { DataTable } from "../../components/common/DataTable"
import { AnimatedElement } from "../../components/common/AnimatedElement"
import type { Grade } from "../../types/grade"

export default function StudentGrades() {
  const { grades, fetchGrades, isLoading } = useGradesStore()
  const [selectedSemester, setSelectedSemester] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    fetchGrades()
  }, [fetchGrades])

  // Extract unique semesters and years for filtering
  const semesters = Array.from(new Set(grades.map((grade) => grade.semester)))
  const years = Array.from(new Set(grades.map((grade) => grade.academicYear)))

  // Filter grades based on selected filters
  const filteredGrades = grades.filter((grade) => {
    const semesterMatch = selectedSemester === "all" || grade.semester === selectedSemester
    const yearMatch = selectedYear === "all" || grade.academicYear === selectedYear
    return semesterMatch && yearMatch
  })

  // Calculate GPA for filtered grades
  const calculateGPA = (grades: Grade[]) => {
    if (grades.length === 0) return 0

    const gradePoints: Record<string, number> = {
      A: 4.0,
      B: 3.0,
      C: 2.0,
      D: 1.0,
      F: 0.0,
    }

    const totalPoints = grades.reduce((sum, grade) => {
      return sum + (gradePoints[grade.letterGrade.charAt(0)] || 0) * grade.creditHours
    }, 0)

    const totalCredits = grades.reduce((sum, grade) => sum + grade.creditHours, 0)

    return totalPoints / totalCredits
  }

  const currentGPA = calculateGPA(filteredGrades)

  // Define columns for the data table
  const columns = [
    {
      header: "Course",
      accessor: "courseName",
    },
    {
      header: "Semester",
      accessor: "semester",
    },
    {
      header: "Year",
      accessor: "academicYear",
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
  ]

  const handleRowClick = (grade: Grade) => {
    setSelectedGrade(grade)
    onOpen()
  }

  return (
    <Box>
      <AnimatedElement animation="fadeIn">
        <Heading size="lg" mb={6}>
          My Grades
        </Heading>
      </AnimatedElement>

      <AnimatedElement animation="slideUp" delay={100}>
        <Card mb={6}>
          <CardHeader pb={0}>
            <Heading size="md">Current GPA</Heading>
          </CardHeader>
          <CardBody>
            <Flex align="center" gap={4}>
              <Text fontSize="3xl" fontWeight="bold" color="brand.600">
                {isLoading ? <Skeleton height="36px" width="80px" /> : currentGPA.toFixed(2)}
              </Text>
              <Text color="gray.600">out of 4.0</Text>
            </Flex>
          </CardBody>
        </Card>
      </AnimatedElement>

      <AnimatedElement animation="slideUp" delay={200}>
        <Flex mb={6} gap={4} direction={{ base: "column", md: "row" }}>
          <Box>
            <Text mb={2} fontWeight="medium">
              Filter by Semester
            </Text>
            <Select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
              <option value="all">All Semesters</option>
              {semesters.map((semester) => (
                <option key={semester} value={semester}>
                  {semester}
                </option>
              ))}
            </Select>
          </Box>
          <Box>
            <Text mb={2} fontWeight="medium">
              Filter by Year
            </Text>
            <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              <option value="all">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Select>
          </Box>
        </Flex>
      </AnimatedElement>

      <AnimatedElement animation="slideUp" delay={300}>
        <Card>
          <CardHeader>
            <Heading size="md">Grade History</Heading>
          </CardHeader>
          <CardBody>
            {isLoading ? (
              <Stack spacing={4}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} height="40px" />
                ))}
              </Stack>
            ) : (
              <DataTable
                columns={columns}
                data={filteredGrades}
                keyExtractor={(item) => item.id}
                isLoading={isLoading}
                onRowClick={handleRowClick}
                searchable={true}
                sortable={true}
                pagination={true}
              />
            )}
          </CardBody>
        </Card>
      </AnimatedElement>

      {/* Grade Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Grade Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedGrade && (
              <Stack spacing={4}>
                <Flex justify="space-between" align="center">
                  <Heading size="md">{selectedGrade.courseName}</Heading>
                  <HStack>
                    <Text fontWeight="bold" fontSize="xl">
                      {selectedGrade.grade}%
                    </Text>
                    <Badge
                      size="lg"
                      colorScheme={
                        selectedGrade.letterGrade === "A"
                          ? "green"
                          : selectedGrade.letterGrade === "B"
                            ? "blue"
                            : selectedGrade.letterGrade === "C"
                              ? "yellow"
                              : selectedGrade.letterGrade === "D"
                                ? "orange"
                                : "red"
                      }
                      px={2}
                      py={1}
                      borderRadius="md"
                    >
                      {selectedGrade.letterGrade}
                    </Badge>
                  </HStack>
                </Flex>

                <Box bg="gray.50" p={4} borderRadius="md">
                  <Stack spacing={3}>
                    <Flex justify="space-between">
                      <Text color="gray.600">Semester</Text>
                      <Text fontWeight="medium">
                        {selectedGrade.semester} {selectedGrade.academicYear}
                      </Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text color="gray.600">Credit Hours</Text>
                      <Text fontWeight="medium">{selectedGrade.creditHours}</Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text color="gray.600">Instructor</Text>
                      <Text fontWeight="medium">{selectedGrade.instructorName}</Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text color="gray.600">Submission Date</Text>
                      <Text fontWeight="medium">{new Date(selectedGrade.submissionDate).toLocaleDateString()}</Text>
                    </Flex>
                  </Stack>
                </Box>

                {selectedGrade.comments && (
                  <Box>
                    <Text fontWeight="medium" mb={2}>
                      Instructor Comments
                    </Text>
                    <Box bg="gray.50" p={4} borderRadius="md">
                      <Text>{selectedGrade.comments}</Text>
                    </Box>
                  </Box>
                )}

                <Button onClick={onClose} mt={4}>
                  Close
                </Button>
              </Stack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}
