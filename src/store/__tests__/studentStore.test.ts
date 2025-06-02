import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { act } from '@testing-library/react'

import { StudentService } from '../../services/studentService'
import type { Student } from '../../types/student'
import { useStudentStore } from '../studentStore'

// Mock the StudentService
jest.mock('../../services/studentService', () => ({
  StudentService: {
    getStudents: jest.fn(),
    getStudentById: jest.fn(),
    getCurrentStudent: jest.fn(),
    createStudent: jest.fn(),
    updateStudent: jest.fn(),
    deleteStudent: jest.fn(),
  },
}))

const mockStudentService = StudentService as jest.Mocked<typeof StudentService>

describe('studentStore', () => {
  // Reset the store before each test
  beforeEach(() => {
    jest.resetAllMocks()
    act(() => {
      useStudentStore.setState({
        students: [],
        currentStudent: null,
        isLoading: false,
        error: null,
      })
    })
  })

  describe('fetchStudents', () => {
    it('should fetch students successfully', async () => {
      // Mock data
      const mockStudents: Student[] = [
        {
          _id: '1',
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          studentId: 'ST001',
          dateOfBirth: '2000-01-01',
          gender: 'male',
          address: '123 Main St',
          phoneNumber: '123-456-7890',
          enrollmentDate: '2022-09-01',
          department: 'Computer Science',
          program: 'Bachelor of Science',
          status: 'active',
        },
        {
          _id: '2',
          id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          studentId: 'ST002',
          dateOfBirth: '2000-02-15',
          gender: 'female',
          address: '456 Oak St',
          phoneNumber: '987-654-3210',
          enrollmentDate: '2021-09-01',
          department: 'Computer Science',
          program: 'Bachelor of Science',
          status: 'active',
        },
      ]

      // Setup mock
      mockStudentService.getStudents.mockResolvedValue(mockStudents)

      // Execute
      await act(async () => {
        await useStudentStore.getState().fetchStudents()
      })

      // Assert
      expect(mockStudentService.getStudents).toHaveBeenCalledTimes(1)
      expect(useStudentStore.getState().students).toEqual(mockStudents)
      expect(useStudentStore.getState().isLoading).toBe(false)
      expect(useStudentStore.getState().error).toBeNull()
    })

    it('should handle errors when fetching students', async () => {
      // Setup mock to throw error
      const errorMessage = 'API error'
      mockStudentService.getStudents.mockRejectedValue(new Error(errorMessage))

      // Execute
      await act(async () => {
        await useStudentStore.getState().fetchStudents()
      })

      // Assert
      expect(mockStudentService.getStudents).toHaveBeenCalledTimes(1)
      expect(useStudentStore.getState().students).toEqual([])
      expect(useStudentStore.getState().isLoading).toBe(false)
      expect(useStudentStore.getState().error).toBe(errorMessage)
    })
  })

  describe('fetchStudentById', () => {
    it('should fetch a student by ID successfully', async () => {
      // Mock data
      const studentId = '1'
      const mockStudent: Student = {
        _id: '1',
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        studentId: 'ST001',
        dateOfBirth: '2000-01-01',
        gender: 'male',
        address: '123 Main St',
        phoneNumber: '123-456-7890',
        enrollmentDate: '2022-09-01',
        department: 'Computer Science',
        program: 'Bachelor of Science',
        status: 'active',
      }

      // Setup mock
      mockStudentService.getStudentById.mockResolvedValue(mockStudent)

      // Execute
      await act(async () => {
        await useStudentStore.getState().fetchStudentById(studentId)
      })

      // Assert
      expect(mockStudentService.getStudentById).toHaveBeenCalledWith(studentId)
      expect(useStudentStore.getState().currentStudent).toEqual(mockStudent)
      expect(useStudentStore.getState().isLoading).toBe(false)
      expect(useStudentStore.getState().error).toBeNull()
    })

    it('should handle errors when fetching a student by ID', async () => {
      // Setup mock to throw error
      const studentId = '999'
      const errorMessage = 'Student not found'
      mockStudentService.getStudentById.mockRejectedValue(new Error(errorMessage))

      // Execute
      await act(async () => {
        await useStudentStore.getState().fetchStudentById(studentId)
      })

      // Assert
      expect(mockStudentService.getStudentById).toHaveBeenCalledWith(studentId)
      expect(useStudentStore.getState().currentStudent).toBeNull()
      expect(useStudentStore.getState().isLoading).toBe(false)
      expect(useStudentStore.getState().error).toBe(errorMessage)
    })
  })

  describe('fetchCurrentStudent', () => {
    it('should fetch the current student successfully', async () => {
      // Mock data
      const mockStudent: Student = {
        _id: '1',
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        studentId: 'ST001',
        dateOfBirth: '2000-01-01',
        gender: 'male',
        address: '123 Main St',
        phoneNumber: '123-456-7890',
        enrollmentDate: '2022-09-01',
        department: 'Computer Science',
        program: 'Bachelor of Science',
        status: 'active',
      }

      // Setup mock
      mockStudentService.getCurrentStudent.mockResolvedValue(mockStudent)

      // Execute
      await act(async () => {
        await useStudentStore.getState().fetchCurrentStudent()
      })

      // Assert
      expect(mockStudentService.getCurrentStudent).toHaveBeenCalledTimes(1)
      expect(useStudentStore.getState().currentStudent).toEqual(mockStudent)
      expect(useStudentStore.getState().isLoading).toBe(false)
      expect(useStudentStore.getState().error).toBeNull()
    })

    it('should handle errors when fetching the current student', async () => {
      // Setup mock to throw error
      const errorMessage = 'Not authenticated'
      mockStudentService.getCurrentStudent.mockRejectedValue(new Error(errorMessage))

      // Execute
      await act(async () => {
        await useStudentStore.getState().fetchCurrentStudent()
      })

      // Assert
      expect(mockStudentService.getCurrentStudent).toHaveBeenCalledTimes(1)
      expect(useStudentStore.getState().currentStudent).toBeNull()
      expect(useStudentStore.getState().isLoading).toBe(false)
      expect(useStudentStore.getState().error).toBe(errorMessage)
    })
  })

  describe('createStudent', () => {
    it('should create a student successfully', async () => {
      // Mock data
      const newStudentData = {
        firstName: 'New',
        lastName: 'Student',
        email: 'new@example.com',
        studentId: 'ST003',
        dateOfBirth: '2001-03-15',
        gender: 'male',
        address: '789 Pine St',
        phoneNumber: '555-123-4567',
        enrollmentDate: '2023-09-01',
        department: 'Computer Science',
        program: 'Bachelor of Science',
        status: 'active' as const,
      }

      const createdStudent: Student = {
        _id: '3',
        id: '3',
        ...newStudentData,
      }

      // Setup initial state with existing students
      const existingStudents: Student[] = [
        {
          _id: '1',
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          studentId: 'ST001',
          dateOfBirth: '2000-01-01',
          gender: 'male',
          address: '123 Main St',
          phoneNumber: '123-456-7890',
          enrollmentDate: '2022-09-01',
          department: 'Computer Science',
          program: 'Bachelor of Science',
          status: 'active',
        },
      ]

      act(() => {
        useStudentStore.setState({
          students: existingStudents,
          isLoading: false,
          error: null,
        })
      })

      // Setup mock
      mockStudentService.createStudent.mockResolvedValue(createdStudent)

      // Execute
      await act(async () => {
        await useStudentStore.getState().createStudent(newStudentData)
      })

      // Assert
      expect(mockStudentService.createStudent).toHaveBeenCalledWith(newStudentData)
      expect(useStudentStore.getState().students).toEqual([...existingStudents, createdStudent])
      expect(useStudentStore.getState().isLoading).toBe(false)
      expect(useStudentStore.getState().error).toBeNull()
    })

    it('should handle errors when creating a student', async () => {
      // Mock data
      const newStudentData = {
        firstName: 'New',
        lastName: 'Student',
        email: 'existing@example.com', // Assume this email already exists
        studentId: 'ST003',
        dateOfBirth: '2001-03-15',
        gender: 'male',
        address: '789 Pine St',
        phoneNumber: '555-123-4567',
        enrollmentDate: '2023-09-01',
        department: 'Computer Science',
        program: 'Bachelor of Science',
        status: 'active' as const,
      }

      // Setup initial state
      const existingStudents: Student[] = [
        {
          _id: '1',
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          studentId: 'ST001',
          dateOfBirth: '2000-01-01',
          gender: 'male',
          address: '123 Main St',
          phoneNumber: '123-456-7890',
          enrollmentDate: '2022-09-01',
          department: 'Computer Science',
          program: 'Bachelor of Science',
          status: 'active',
        },
      ]

      act(() => {
        useStudentStore.setState({
          students: existingStudents,
          isLoading: false,
          error: null,
        })
      })

      // Setup mock to throw error
      const errorMessage = 'Email already exists'
      mockStudentService.createStudent.mockRejectedValue(new Error(errorMessage))

      // Execute
      await act(async () => {
        await useStudentStore.getState().createStudent(newStudentData)
      })

      // Assert
      expect(mockStudentService.createStudent).toHaveBeenCalledWith(newStudentData)
      expect(useStudentStore.getState().students).toEqual(existingStudents) // Should not change
      expect(useStudentStore.getState().isLoading).toBe(false)
      expect(useStudentStore.getState().error).toBe(errorMessage)
    })
  })

  describe('updateStudent', () => {
    it('should update a student successfully', async () => {
      // Setup initial state with existing students
      const existingStudents: Student[] = [
        {
          _id: '1',
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          studentId: 'ST001',
          dateOfBirth: '2000-01-01',
          gender: 'male',
          address: '123 Main St',
          phoneNumber: '123-456-7890',
          enrollmentDate: '2022-09-01',
          department: 'Computer Science',
          program: 'Bachelor of Science',
          status: 'active',
        },
        {
          _id: '2',
          id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          studentId: 'ST002',
          dateOfBirth: '2000-02-15',
          gender: 'female',
          address: '456 Oak St',
          phoneNumber: '987-654-3210',
          enrollmentDate: '2021-09-01',
          department: 'Computer Science',
          program: 'Bachelor of Science',
          status: 'active',
        },
      ]

      act(() => {
        useStudentStore.setState({
          students: existingStudents,
          currentStudent: existingStudents[0],
          isLoading: false,
          error: null,
        })
      })

      // Mock data for update
      const studentId = '1'
      const studentUpdate = {
        firstName: 'John',
        lastName: 'Updated',
        department: 'Data Science',
      }

      const updatedStudent: Student = {
        _id: '1',
        id: '1',
        firstName: 'John',
        lastName: 'Updated', // Updated
        email: 'john@example.com',
        studentId: 'ST001',
        dateOfBirth: '2000-01-01',
        gender: 'male',
        address: '123 Main St',
        phoneNumber: '123-456-7890',
        enrollmentDate: '2022-09-01',
        department: 'Data Science', // Updated
        program: 'Bachelor of Science',
        status: 'active',
      }

      // Setup mock
      mockStudentService.updateStudent.mockResolvedValue(updatedStudent)

      // Execute
      await act(async () => {
        await useStudentStore.getState().updateStudent(studentId, studentUpdate)
      })

      // Assert
      expect(mockStudentService.updateStudent).toHaveBeenCalledWith(studentId, studentUpdate)
      expect(useStudentStore.getState().students).toEqual([updatedStudent, existingStudents[1]])
      expect(useStudentStore.getState().currentStudent).toEqual(updatedStudent)
      expect(useStudentStore.getState().isLoading).toBe(false)
      expect(useStudentStore.getState().error).toBeNull()
    })

    it('should update a student that is not the current student', async () => {
      // Setup initial state with existing students
      const existingStudents: Student[] = [
        {
          _id: '1',
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          studentId: 'ST001',
          dateOfBirth: '2000-01-01',
          gender: 'male',
          address: '123 Main St',
          phoneNumber: '123-456-7890',
          enrollmentDate: '2022-09-01',
          department: 'Computer Science',
          program: 'Bachelor of Science',
          status: 'active',
        },
        {
          _id: '2',
          id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          studentId: 'ST002',
          dateOfBirth: '2000-02-15',
          gender: 'female',
          address: '456 Oak St',
          phoneNumber: '987-654-3210',
          enrollmentDate: '2021-09-01',
          department: 'Computer Science',
          program: 'Bachelor of Science',
          status: 'active',
        },
      ]

      act(() => {
        useStudentStore.setState({
          students: existingStudents,
          currentStudent: existingStudents[0], // Current student is John
          isLoading: false,
          error: null,
        })
      })

      // Mock data for update
      const studentId = '2' // Updating Jane
      const studentUpdate = {
        firstName: 'Jane',
        lastName: 'Updated',
      }

      const updatedStudent: Student = {
        _id: '2',
        id: '2',
        firstName: 'Jane',
        lastName: 'Updated', // Updated
        email: 'jane@example.com',
        studentId: 'ST002',
        dateOfBirth: '2000-02-15',
        gender: 'female',
        address: '456 Oak St',
        phoneNumber: '987-654-3210',
        enrollmentDate: '2021-09-01',
        department: 'Computer Science',
        program: 'Bachelor of Science',
        status: 'active',
      }

      // Setup mock
      mockStudentService.updateStudent.mockResolvedValue(updatedStudent)

      // Execute
      await act(async () => {
        await useStudentStore.getState().updateStudent(studentId, studentUpdate)
      })

      // Assert
      expect(mockStudentService.updateStudent).toHaveBeenCalledWith(studentId, studentUpdate)
      expect(useStudentStore.getState().students).toEqual([existingStudents[0], updatedStudent])
      expect(useStudentStore.getState().currentStudent).toEqual(existingStudents[0]) // Current student should not change
      expect(useStudentStore.getState().isLoading).toBe(false)
      expect(useStudentStore.getState().error).toBeNull()
    })

    it('should handle errors when updating a student', async () => {
      // Setup initial state
      const existingStudents: Student[] = [
        {
          _id: '1',
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          studentId: 'ST001',
          dateOfBirth: '2000-01-01',
          gender: 'male',
          address: '123 Main St',
          phoneNumber: '123-456-7890',
          enrollmentDate: '2022-09-01',
          department: 'Computer Science',
          program: 'Bachelor of Science',
          status: 'active',
        },
      ]

      act(() => {
        useStudentStore.setState({
          students: existingStudents,
          isLoading: false,
          error: null,
        })
      })

      // Mock data for update
      const studentId = '1'
      const studentUpdate = {
        email: 'existing@example.com', // Assume this email already exists
      }

      // Setup mock to throw error
      const errorMessage = 'Email already exists'
      mockStudentService.updateStudent.mockRejectedValue(new Error(errorMessage))

      // Execute
      await act(async () => {
        await useStudentStore.getState().updateStudent(studentId, studentUpdate)
      })

      // Assert
      expect(mockStudentService.updateStudent).toHaveBeenCalledWith(studentId, studentUpdate)
      expect(useStudentStore.getState().students).toEqual(existingStudents) // Should not change
      expect(useStudentStore.getState().isLoading).toBe(false)
      expect(useStudentStore.getState().error).toBe(errorMessage)
    })
  })

  describe('deleteStudent', () => {
    it('should delete a student successfully', async () => {
      // Setup initial state with existing students
      const existingStudents: Student[] = [
        {
          _id: '1',
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          studentId: 'ST001',
          dateOfBirth: '2000-01-01',
          gender: 'male',
          address: '123 Main St',
          phoneNumber: '123-456-7890',
          enrollmentDate: '2022-09-01',
          department: 'Computer Science',
          program: 'Bachelor of Science',
          status: 'active',
        },
        {
          _id: '2',
          id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          studentId: 'ST002',
          dateOfBirth: '2000-02-15',
          gender: 'female',
          address: '456 Oak St',
          phoneNumber: '987-654-3210',
          enrollmentDate: '2021-09-01',
          department: 'Computer Science',
          program: 'Bachelor of Science',
          status: 'active',
        },
      ]

      act(() => {
        useStudentStore.setState({
          students: existingStudents,
          isLoading: false,
          error: null,
        })
      })

      // Mock data for delete
      const studentId = '1'

      // Setup mock
      mockStudentService.deleteStudent.mockResolvedValue(undefined)

      // Execute
      await act(async () => {
        await useStudentStore.getState().deleteStudent(studentId)
      })

      // Assert
      expect(mockStudentService.deleteStudent).toHaveBeenCalledWith(studentId)
      expect(useStudentStore.getState().students).toEqual([existingStudents[1]])
      expect(useStudentStore.getState().isLoading).toBe(false)
      expect(useStudentStore.getState().error).toBeNull()
    })

    it('should handle errors when deleting a student', async () => {
      // Setup initial state
      const existingStudents: Student[] = [
        {
          _id: '1',
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          studentId: 'ST001',
          dateOfBirth: '2000-01-01',
          gender: 'male',
          address: '123 Main St',
          phoneNumber: '123-456-7890',
          enrollmentDate: '2022-09-01',
          department: 'Computer Science',
          program: 'Bachelor of Science',
          status: 'active',
        },
      ]

      act(() => {
        useStudentStore.setState({
          students: existingStudents,
          isLoading: false,
          error: null,
        })
      })

      // Mock data for delete
      const studentId = '1'

      // Setup mock to throw error
      const errorMessage = 'Permission denied'
      mockStudentService.deleteStudent.mockRejectedValue(new Error(errorMessage))

      // Execute
      await act(async () => {
        await useStudentStore.getState().deleteStudent(studentId)
      })

      // Assert
      expect(mockStudentService.deleteStudent).toHaveBeenCalledWith(studentId)
      expect(useStudentStore.getState().students).toEqual(existingStudents) // Should not change
      expect(useStudentStore.getState().isLoading).toBe(false)
      expect(useStudentStore.getState().error).toBe(errorMessage)
    })
  })
})
