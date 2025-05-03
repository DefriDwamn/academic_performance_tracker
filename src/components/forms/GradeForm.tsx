"use client"

import type React from "react"

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  VStack,
  SimpleGrid,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { Grade } from "../../types/grade"

const gradeSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  courseId: z.string().min(1, "Course is required"),
  courseName: z.string().min(1, "Course name is required"),
  semester: z.string().min(1, "Semester is required"),
  academicYear: z.string().min(1, "Academic year is required"),
  grade: z.number().min(0, "Grade must be at least 0").max(100, "Grade cannot exceed 100"),
  letterGrade: z.string().min(1, "Letter grade is required"),
  creditHours: z.number().min(0, "Credit hours must be at least 0"),
  submissionDate: z.string().min(1, "Submission date is required"),
  instructorId: z.string().min(1, "Instructor is required"),
  instructorName: z.string().min(1, "Instructor name is required"),
  comments: z.string().optional(),
})

type GradeFormData = z.infer<typeof gradeSchema>

interface GradeFormProps {
  initialData?: Partial<Grade>
  onSubmit: (data: GradeFormData) => void
  isLoading?: boolean
  students: { id: string; name: string }[]
  courses: { id: string; name: string }[]
  instructors: { id: string; name: string }[]
}

export const GradeForm = ({
  initialData = {},
  onSubmit,
  isLoading = false,
  students,
  courses,
  instructors,
}: GradeFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<GradeFormData>({
    resolver: zodResolver(gradeSchema),
    defaultValues: {
      ...initialData,
      grade: initialData.grade || 0,
      creditHours: initialData.creditHours || 0,
    },
  })

  // Auto-fill course name when course is selected
  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const courseId = e.target.value
    const course = courses.find((c) => c.id === courseId)
    if (course) {
      setValue("courseName", course.name)
    }
  }

  // Auto-fill instructor name when instructor is selected
  const handleInstructorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const instructorId = e.target.value
    const instructor = instructors.find((i) => i.id === instructorId)
    if (instructor) {
      setValue("instructorName", instructor.name)
    }
  }

  // Calculate letter grade based on numeric grade
  const calculateLetterGrade = (numericGrade: number) => {
    if (numericGrade >= 90) return "A"
    if (numericGrade >= 80) return "B"
    if (numericGrade >= 70) return "C"
    if (numericGrade >= 60) return "D"
    return "F"
  }

  const handleGradeChange = (valueAsString: string, valueAsNumber: number) => {
    setValue("grade", valueAsNumber)
    setValue("letterGrade", calculateLetterGrade(valueAsNumber))
  }

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <VStack spacing={6} align="stretch">
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <FormControl isInvalid={!!errors.studentId}>
            <FormLabel>Student</FormLabel>
            <Select placeholder="Select student" {...register("studentId")}>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.studentId?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.courseId}>
            <FormLabel>Course</FormLabel>
            <Select placeholder="Select course" {...register("courseId")} onChange={handleCourseChange}>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.courseId?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.courseName} display="none">
            <FormLabel>Course Name</FormLabel>
            <Input {...register("courseName")} />
            <FormErrorMessage>{errors.courseName?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.semester}>
            <FormLabel>Semester</FormLabel>
            <Select placeholder="Select semester" {...register("semester")}>
              <option value="Fall">Fall</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Winter">Winter</option>
            </Select>
            <FormErrorMessage>{errors.semester?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.academicYear}>
            <FormLabel>Academic Year</FormLabel>
            <Input {...register("academicYear")} placeholder="e.g., 2023-2024" />
            <FormErrorMessage>{errors.academicYear?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.grade}>
            <FormLabel>Grade (0-100)</FormLabel>
            <Controller
              name="grade"
              control={control}
              render={({ field }) => (
                <NumberInput min={0} max={100} value={field.value} onChange={handleGradeChange}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              )}
            />
            <FormErrorMessage>{errors.grade?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.letterGrade}>
            <FormLabel>Letter Grade</FormLabel>
            <Select {...register("letterGrade")}>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="F">F</option>
              <option value="I">I (Incomplete)</option>
              <option value="W">W (Withdrawn)</option>
            </Select>
            <FormErrorMessage>{errors.letterGrade?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.creditHours}>
            <FormLabel>Credit Hours</FormLabel>
            <Controller
              name="creditHours"
              control={control}
              render={({ field }) => (
                <NumberInput min={0} max={12} value={field.value} onChange={field.onChange}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              )}
            />
            <FormErrorMessage>{errors.creditHours?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.submissionDate}>
            <FormLabel>Submission Date</FormLabel>
            <Input type="date" {...register("submissionDate")} />
            <FormErrorMessage>{errors.submissionDate?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.instructorId}>
            <FormLabel>Instructor</FormLabel>
            <Select placeholder="Select instructor" {...register("instructorId")} onChange={handleInstructorChange}>
              {instructors.map((instructor) => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.instructorId?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.instructorName} display="none">
            <FormLabel>Instructor Name</FormLabel>
            <Input {...register("instructorName")} />
            <FormErrorMessage>{errors.instructorName?.message}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>

        <FormControl isInvalid={!!errors.comments}>
          <FormLabel>Comments</FormLabel>
          <Textarea {...register("comments")} placeholder="Additional comments about the grade" rows={4} />
          <FormErrorMessage>{errors.comments?.message}</FormErrorMessage>
        </FormControl>

        <Button mt={6} colorScheme="brand" type="submit" isLoading={isLoading} loadingText="Submitting">
          {initialData.id ? "Update Grade" : "Add Grade"}
        </Button>
      </VStack>
    </Box>
  )
}
