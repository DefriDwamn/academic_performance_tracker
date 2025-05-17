'use client'

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
  Heading,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Student } from '../../types/student'

const studentSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  studentId: z.string().min(1, 'Student ID is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Gender is required'),
  address: z.string().min(1, 'Address is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  enrollmentDate: z.string().min(1, 'Enrollment date is required'),
  graduationDate: z.string().optional(),
  department: z.string().min(1, 'Department is required'),
  program: z.string().min(1, 'Program is required'),
  status: z.enum(['active', 'inactive', 'graduated', 'suspended']),
})

export type StudentFormData = z.infer<typeof studentSchema>

interface StudentFormProps {
  initialData?: Partial<Student>
  onSubmit: (data: StudentFormData) => void
  isLoading?: boolean
}

export const StudentForm = ({
  initialData = {},
  onSubmit,
  isLoading = false,
}: StudentFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      ...initialData,
      dateOfBirth: initialData.dateOfBirth
        ? new Date(initialData.dateOfBirth).toISOString().split('T')[0]
        : '',
      enrollmentDate: initialData.enrollmentDate
        ? new Date(initialData.enrollmentDate).toISOString().split('T')[0]
        : '',
      graduationDate: initialData.graduationDate
        ? new Date(initialData.graduationDate).toISOString().split('T')[0]
        : '',
    },
  })

  const handleFormSubmit = (data: StudentFormData) => {
    // Convert dates to ISO strings
    const formattedData = {
      ...data,
      dateOfBirth: new Date(data.dateOfBirth).toISOString(),
      enrollmentDate: new Date(data.enrollmentDate).toISOString(),
      graduationDate: data.graduationDate ? new Date(data.graduationDate).toISOString() : undefined,
    }
    onSubmit(formattedData)
  }

  return (
    <Box as="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <VStack spacing={6} align="stretch">
        <Heading size="md">Student Information</Heading>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <FormControl isInvalid={!!errors.firstName}>
            <FormLabel>First Name</FormLabel>
            <Input {...register('firstName')} />
            <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.lastName}>
            <FormLabel>Last Name</FormLabel>
            <Input {...register('lastName')} />
            <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input type="email" {...register('email')} />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.studentId}>
            <FormLabel>Student ID</FormLabel>
            <Input {...register('studentId')} />
            <FormErrorMessage>{errors.studentId?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.dateOfBirth}>
            <FormLabel>Date of Birth</FormLabel>
            <Input type="date" {...register('dateOfBirth')} />
            <FormErrorMessage>{errors.dateOfBirth?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.gender}>
            <FormLabel>Gender</FormLabel>
            <Select placeholder="Select gender" {...register('gender')}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </Select>
            <FormErrorMessage>{errors.gender?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.phoneNumber}>
            <FormLabel>Phone Number</FormLabel>
            <Input {...register('phoneNumber')} />
            <FormErrorMessage>{errors.phoneNumber?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.address}>
            <FormLabel>Address</FormLabel>
            <Input {...register('address')} />
            <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>

        <Heading size="md" mt={4}>
          Academic Information
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <FormControl isInvalid={!!errors.department}>
            <FormLabel>Department</FormLabel>
            <Select placeholder="Select department" {...register('department')}>
              <option value="computer_science">Computer Science</option>
              <option value="engineering">Engineering</option>
              <option value="business">Business</option>
              <option value="arts">Arts</option>
              <option value="science">Science</option>
            </Select>
            <FormErrorMessage>{errors.department?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.program}>
            <FormLabel>Program</FormLabel>
            <Select placeholder="Select program" {...register('program')}>
              <option value="bachelor">Bachelor's</option>
              <option value="master">Master's</option>
              <option value="phd">PhD</option>
              <option value="diploma">Diploma</option>
            </Select>
            <FormErrorMessage>{errors.program?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.enrollmentDate}>
            <FormLabel>Enrollment Date</FormLabel>
            <Input type="date" {...register('enrollmentDate')} />
            <FormErrorMessage>{errors.enrollmentDate?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.graduationDate}>
            <FormLabel>Expected Graduation Date</FormLabel>
            <Input type="date" {...register('graduationDate')} />
            <FormErrorMessage>{errors.graduationDate?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.status}>
            <FormLabel>Status</FormLabel>
            <Select placeholder="Select status" {...register('status')}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="graduated">Graduated</option>
              <option value="suspended">Suspended</option>
            </Select>
            <FormErrorMessage>{errors.status?.message}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>

        <Button
          mt={6}
          colorScheme="brand"
          type="submit"
          isLoading={isLoading}
          loadingText="Submitting"
        >
          {initialData.id ? 'Update Student' : 'Add Student'}
        </Button>
      </VStack>
    </Box>
  )
}
