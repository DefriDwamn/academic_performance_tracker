import { beforeEach, describe, expect, it, jest } from '@jest/globals'

import type { Student } from '../../types/student'
import api, { handleApiError } from '../api'
import { StudentService } from '../studentService'

// Mock the api module
jest.mock('../api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
  handleApiError: jest.fn((error: unknown) => (error as Error).message || 'Unknown error'),
}))

const mockApi = api as jest.Mocked<typeof api>
const mockHandleApiError = handleApiError as jest.MockedFunction<typeof handleApiError>

describe('StudentService', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getStudents', () => {
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
      ]

      // Setup mock
      mockApi.get.mockResolvedValue({ data: mockStudents })

      // Execute
      const result = await StudentService.getStudents()

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith('/students')
      expect(result).toEqual(mockStudents)
    })

    it('should handle errors when fetching students', async () => {
      // Setup mock to throw error
      const errorMessage = 'API error'
      const error = new Error(errorMessage)
      mockApi.get.mockRejectedValue(error)
      mockHandleApiError.mockReturnValue(errorMessage)

      // Execute and assert
      await expect(StudentService.getStudents()).rejects.toThrow(errorMessage)
      expect(mockApi.get).toHaveBeenCalledWith('/students')
    })
  })

  describe('getStudentById', () => {
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
      mockApi.get.mockResolvedValue({ data: mockStudent })

      // Execute
      const result = await StudentService.getStudentById(studentId)

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith(`/students/${studentId}`)
      expect(result).toEqual(mockStudent)
    })

    it('should handle errors when fetching a student by ID', async () => {
      // Setup mock to throw error
      const studentId = '999'
      const errorMessage = 'Student not found'
      const error = new Error(errorMessage)
      mockApi.get.mockRejectedValue(error)
      mockHandleApiError.mockReturnValue(errorMessage)

      // Execute and assert
      await expect(StudentService.getStudentById(studentId)).rejects.toThrow(errorMessage)
      expect(mockApi.get).toHaveBeenCalledWith(`/students/${studentId}`)
    })
  })

  describe('getCurrentStudent', () => {
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
      mockApi.get.mockResolvedValue({ data: mockStudent })

      // Execute
      const result = await StudentService.getCurrentStudent()

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith('/students/me')
      expect(result).toEqual(mockStudent)
    })

    it('should handle errors when fetching the current student', async () => {
      // Setup mock to throw error
      const errorMessage = 'Not authenticated'
      const error = new Error(errorMessage)
      mockApi.get.mockRejectedValue(error)
      mockHandleApiError.mockReturnValue(errorMessage)

      // Execute and assert
      await expect(StudentService.getCurrentStudent()).rejects.toThrow(errorMessage)
      expect(mockApi.get).toHaveBeenCalledWith('/students/me')
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

      // Setup mock
      mockApi.post.mockResolvedValue({ data: createdStudent })

      // Execute
      const result = await StudentService.createStudent(newStudentData)

      // Assert
      expect(mockApi.post).toHaveBeenCalledWith('/students', newStudentData)
      expect(result).toEqual(createdStudent)
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

      // Setup mock to throw error
      const errorMessage = 'Email already exists'
      const error = new Error(errorMessage)
      mockApi.post.mockRejectedValue(error)
      mockHandleApiError.mockReturnValue(errorMessage)

      // Execute and assert
      await expect(StudentService.createStudent(newStudentData)).rejects.toThrow(errorMessage)
      expect(mockApi.post).toHaveBeenCalledWith('/students', newStudentData)
    })
  })

  describe('updateStudent', () => {
    it('should update a student successfully', async () => {
      // Mock data
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
      mockApi.put.mockResolvedValue({ data: updatedStudent })

      // Execute
      const result = await StudentService.updateStudent(studentId, studentUpdate)

      // Assert
      expect(mockApi.put).toHaveBeenCalledWith(`/students/${studentId}`, studentUpdate)
      expect(result).toEqual(updatedStudent)
    })

    it('should handle errors when updating a student', async () => {
      // Mock data
      const studentId = '1'
      const studentUpdate = {
        email: 'existing@example.com', // Assume this email already exists
      }

      // Setup mock to throw error
      const errorMessage = 'Email already exists'
      const error = new Error(errorMessage)
      mockApi.put.mockRejectedValue(error)
      mockHandleApiError.mockReturnValue(errorMessage)

      // Execute and assert
      await expect(StudentService.updateStudent(studentId, studentUpdate)).rejects.toThrow(
        errorMessage
      )
      expect(mockApi.put).toHaveBeenCalledWith(`/students/${studentId}`, studentUpdate)
    })
  })

  describe('deleteStudent', () => {
    it('should delete a student successfully', async () => {
      // Mock data
      const studentId = '1'

      // Setup mock
      mockApi.delete.mockResolvedValue({ data: undefined })

      // Execute
      await StudentService.deleteStudent(studentId)

      // Assert
      expect(mockApi.delete).toHaveBeenCalledWith(`/students/${studentId}`)
    })

    it('should handle errors when deleting a student', async () => {
      // Mock data
      const studentId = '1'

      // Setup mock to throw error
      const errorMessage = 'Permission denied'
      const error = new Error(errorMessage)
      mockApi.delete.mockRejectedValue(error)
      mockHandleApiError.mockReturnValue(errorMessage)

      // Execute and assert
      await expect(StudentService.deleteStudent(studentId)).rejects.toThrow(errorMessage)
      expect(mockApi.delete).toHaveBeenCalledWith(`/students/${studentId}`)
    })
  })
})
