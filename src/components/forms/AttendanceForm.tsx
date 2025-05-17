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
import type { Attendance } from "../../types/attendance"

const attendanceSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  courseId: z.string().min(1, "Course is required"),
  courseName: z.string().min(1, "Course name is required"),
  date: z.string().min(1, "Date is required"),
  status: z.enum(["present", "absent", "late", "excused"]),
  duration: z.number().optional(),
  notes: z.string().optional(),
})

type AttendanceFormData = z.infer<typeof attendanceSchema>

interface StudentOption {
  id: string
  name: string
}

interface AttendanceFormProps {
  initialData?: Partial<Attendance>
  onSubmit: (data: Omit<Attendance, "id">) => void
  isLoading?: boolean
  students: StudentOption[]
  courses: { id: string; name: string }[]
}

export const AttendanceForm = ({
  initialData = {},
  onSubmit,
  isLoading = false,
  students,
  courses,
}: AttendanceFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      ...initialData,
      duration: initialData.duration || 0,
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

          <FormControl isInvalid={!!errors.date}>
            <FormLabel>Date</FormLabel>
            <Input type="date" {...register("date")} />
            <FormErrorMessage>{errors.date?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.status}>
            <FormLabel>Status</FormLabel>
            <Select placeholder="Select status" {...register("status")}>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="excused">Excused</option>
            </Select>
            <FormErrorMessage>{errors.status?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.duration}>
            <FormLabel>Duration (minutes)</FormLabel>
            <Controller
              name="duration"
              control={control}
              render={({ field }) => (
                <NumberInput min={0} value={field.value || 0} onChange={field.onChange}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              )}
            />
            <FormErrorMessage>{errors.duration?.message}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>

        <FormControl isInvalid={!!errors.notes}>
          <FormLabel>Notes</FormLabel>
          <Textarea {...register("notes")} placeholder="Additional notes about attendance" rows={4} />
          <FormErrorMessage>{errors.notes?.message}</FormErrorMessage>
        </FormControl>

        <Button mt={6} colorScheme="brand" type="submit" isLoading={isLoading} loadingText="Submitting">
          {initialData.id ? "Update Attendance" : "Add Attendance"}
        </Button>
      </VStack>
    </Box>
  )
}
