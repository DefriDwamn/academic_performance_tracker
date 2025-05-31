import { beforeEach, describe, expect, it, jest } from "@jest/globals"
import { act } from "@testing-library/react"

import { GradeService } from "../../services/gradeService"
import { useGradesStore } from "../gradesStore"
import type { Grade } from "../../types/grade"

// Mock the GradeService
jest.mock("../../services/gradeService", () => ({
  GradeService: {
    getGrades: jest.fn(),
    addGrade: jest.fn(),
    updateGrade: jest.fn(),
  },
}))

const mockGradeService = GradeService as jest.Mocked<typeof GradeService>

describe("gradesStore", () => {
  // Reset the store before each test
  beforeEach(() => {
    jest.resetAllMocks()
    act(() => {
      useGradesStore.setState({
        grades: [],
        isLoading: false,
        error: null,
      })
    })
  })

  describe("fetchGrades", () => {
    it("should fetch grades successfully", async () => {
      // Mock data
      const mockGrades: Grade[] = [
        {
          id: "1",
          studentId: "student1",
          studentName: "John Doe",
          courseId: "course1",
          courseName: "Mathematics",
          semester: "Fall 2023",
          academicYear: "2023-2024",
          grade: 85,
          letterGrade: "B+",
          creditHours: 3,
          submissionDate: "2023-05-01",
          instructorId: "instructor1",
          instructorName: "Dr. Smith",
        },
        {
          id: "2",
          studentId: "student2",
          studentName: "Jane Doe",
          courseId: "course1",
          courseName: "Mathematics",
          semester: "Fall 2023",
          academicYear: "2023-2024",
          grade: 92,
          letterGrade: "A",
          creditHours: 3,
          submissionDate: "2023-05-01",
          instructorId: "instructor1",
          instructorName: "Dr. Smith",
        },
      ]

      // Setup mock
      mockGradeService.getGrades.mockResolvedValue(mockGrades)

      // Execute
      await act(async () => {
        await useGradesStore.getState().fetchGrades()
      })

      // Assert
      expect(mockGradeService.getGrades).toHaveBeenCalledTimes(1)
      expect(mockGradeService.getGrades).toHaveBeenCalledWith({})
      expect(useGradesStore.getState().grades).toEqual(mockGrades)
      expect(useGradesStore.getState().isLoading).toBe(false)
      expect(useGradesStore.getState().error).toBeNull()
    })

    it("should fetch grades with filters", async () => {
      // Mock data
      const mockGrades: Grade[] = [
        {
          id: "1",
          studentId: "student1",
          studentName: "John Doe",
          courseId: "course1",
          courseName: "Mathematics",
          semester: "Fall 2023",
          academicYear: "2023-2024",
          grade: 85,
          letterGrade: "B+",
          creditHours: 3,
          submissionDate: "2023-05-01",
          instructorId: "instructor1",
          instructorName: "Dr. Smith",
        },
      ]

      const filters = { courseId: "course1", studentId: "student1" }

      // Setup mock
      mockGradeService.getGrades.mockResolvedValue(mockGrades)

      // Execute
      await act(async () => {
        await useGradesStore.getState().fetchGrades(filters)
      })

      // Assert
      expect(mockGradeService.getGrades).toHaveBeenCalledTimes(1)
      expect(mockGradeService.getGrades).toHaveBeenCalledWith(filters)
      expect(useGradesStore.getState().grades).toEqual(mockGrades)
    })

    it("should handle errors when fetching grades", async () => {
      // Setup mock to throw error
      const errorMessage = "API error"
      mockGradeService.getGrades.mockRejectedValue(new Error(errorMessage))

      // Execute
      await act(async () => {
        await useGradesStore.getState().fetchGrades()
      })

      // Assert
      expect(mockGradeService.getGrades).toHaveBeenCalledTimes(1)
      expect(useGradesStore.getState().grades).toEqual([])
      expect(useGradesStore.getState().isLoading).toBe(false)
      expect(useGradesStore.getState().error).toBe(errorMessage)
    })
  })

  describe("addGrade", () => {
    it("should add a grade successfully", async () => {
      // Mock data
      const newGrade: Omit<Grade, "id"> = {
        studentId: "student3",
        studentName: "Bob Smith",
        courseId: "course2",
        courseName: "Physics",
        semester: "Fall 2023",
        academicYear: "2023-2024",
        grade: 78,
        letterGrade: "C+",
        creditHours: 4,
        submissionDate: "2023-05-02",
        instructorId: "instructor2",
        instructorName: "Dr. Johnson",
      }

      const returnedGrade: Grade = {
        id: "3",
        ...newGrade,
      }

      // Setup initial state with existing grades
      const existingGrades: Grade[] = [
        {
          id: "1",
          studentId: "student1",
          studentName: "John Doe",
          courseId: "course1",
          courseName: "Mathematics",
          semester: "Fall 2023",
          academicYear: "2023-2024",
          grade: 85,
          letterGrade: "B+",
          creditHours: 3,
          submissionDate: "2023-05-01",
          instructorId: "instructor1",
          instructorName: "Dr. Smith",
        },
      ]

      act(() => {
        useGradesStore.setState({
          grades: existingGrades,
          isLoading: false,
          error: null,
        })
      })

      // Setup mock
      mockGradeService.addGrade.mockResolvedValue(returnedGrade)

      // Execute
      await act(async () => {
        await useGradesStore.getState().addGrade(newGrade)
      })

      // Assert
      expect(mockGradeService.addGrade).toHaveBeenCalledTimes(1)
      expect(mockGradeService.addGrade).toHaveBeenCalledWith(newGrade)
      expect(useGradesStore.getState().grades).toEqual([...existingGrades, returnedGrade])
      expect(useGradesStore.getState().isLoading).toBe(false)
      expect(useGradesStore.getState().error).toBeNull()
    })

    it("should handle errors when adding a grade", async () => {
      // Mock data
      const newGrade: Omit<Grade, "id"> = {
        studentId: "student3",
        studentName: "Bob Smith",
        courseId: "course2",
        courseName: "Physics",
        semester: "Fall 2023",
        academicYear: "2023-2024",
        grade: 78,
        letterGrade: "C+",
        creditHours: 4,
        submissionDate: "2023-05-02",
        instructorId: "instructor2",
        instructorName: "Dr. Johnson",
      }

      // Setup initial state
      const existingGrades: Grade[] = [
        {
          id: "1",
          studentId: "student1",
          studentName: "John Doe",
          courseId: "course1",
          courseName: "Mathematics",
          semester: "Fall 2023",
          academicYear: "2023-2024",
          grade: 85,
          letterGrade: "B+",
          creditHours: 3,
          submissionDate: "2023-05-01",
          instructorId: "instructor1",
          instructorName: "Dr. Smith",
        },
      ]

      act(() => {
        useGradesStore.setState({
          grades: existingGrades,
          isLoading: false,
          error: null,
        })
      })

      // Setup mock to throw error
      const errorMessage = "API error"
      mockGradeService.addGrade.mockRejectedValue(new Error(errorMessage))

      // Execute
      await act(async () => {
        await useGradesStore.getState().addGrade(newGrade)
      })

      // Assert
      expect(mockGradeService.addGrade).toHaveBeenCalledTimes(1)
      expect(useGradesStore.getState().grades).toEqual(existingGrades) // Should not change
      expect(useGradesStore.getState().isLoading).toBe(false)
      expect(useGradesStore.getState().error).toBe(errorMessage)
    })
  })

  describe("updateGrade", () => {
    it("should update a grade successfully", async () => {
      // Setup initial state with existing grades
      const existingGrades: Grade[] = [
        {
          id: "1",
          studentId: "student1",
          studentName: "John Doe",
          courseId: "course1",
          courseName: "Mathematics",
          semester: "Fall 2023",
          academicYear: "2023-2024",
          grade: 85,
          letterGrade: "B+",
          creditHours: 3,
          submissionDate: "2023-05-01",
          instructorId: "instructor1",
          instructorName: "Dr. Smith",
        },
        {
          id: "2",
          studentId: "student2",
          studentName: "Jane Doe",
          courseId: "course1",
          courseName: "Mathematics",
          semester: "Fall 2023",
          academicYear: "2023-2024",
          grade: 92,
          letterGrade: "A",
          creditHours: 3,
          submissionDate: "2023-05-01",
          instructorId: "instructor1",
          instructorName: "Dr. Smith",
        },
      ]

      act(() => {
        useGradesStore.setState({
          grades: existingGrades,
          isLoading: false,
          error: null,
        })
      })

      // Mock data for update
      const gradeId = "1"
      const gradeUpdate: Partial<Grade> = {
        grade: 90,
        letterGrade: "A-",
      }

      const updatedGrade: Grade = {
        id: "1",
        studentId: "student1",
        studentName: "John Doe",
        courseId: "course1",
        courseName: "Mathematics",
        semester: "Fall 2023",
        academicYear: "2023-2024",
        grade: 90, // Updated grade
        letterGrade: "A-", // Updated letterGrade
        creditHours: 3,
        submissionDate: "2023-05-01",
        instructorId: "instructor1",
        instructorName: "Dr. Smith",
      }

      // Setup mock
      mockGradeService.updateGrade.mockResolvedValue(updatedGrade)

      // Execute
      await act(async () => {
        await useGradesStore.getState().updateGrade(gradeId, gradeUpdate)
      })

      // Assert
      expect(mockGradeService.updateGrade).toHaveBeenCalledTimes(1)
      expect(mockGradeService.updateGrade).toHaveBeenCalledWith(gradeId, gradeUpdate)
      expect(useGradesStore.getState().grades).toEqual([updatedGrade, existingGrades[1]])
      expect(useGradesStore.getState().isLoading).toBe(false)
      expect(useGradesStore.getState().error).toBeNull()
    })

    it("should handle errors when updating a grade", async () => {
      // Setup initial state
      const existingGrades: Grade[] = [
        {
          id: "1",
          studentId: "student1",
          studentName: "John Doe",
          courseId: "course1",
          courseName: "Mathematics",
          semester: "Fall 2023",
          academicYear: "2023-2024",
          grade: 85,
          letterGrade: "B+",
          creditHours: 3,
          submissionDate: "2023-05-01",
          instructorId: "instructor1",
          instructorName: "Dr. Smith",
        },
      ]

      act(() => {
        useGradesStore.setState({
          grades: existingGrades,
          isLoading: false,
          error: null,
        })
      })

      // Mock data for update
      const gradeId = "1"
      const gradeUpdate: Partial<Grade> = {
        grade: 90,
        letterGrade: "A-",
      }

      // Setup mock to throw error
      const errorMessage = "API error"
      mockGradeService.updateGrade.mockRejectedValue(new Error(errorMessage))

      // Execute
      await act(async () => {
        await useGradesStore.getState().updateGrade(gradeId, gradeUpdate)
      })

      // Assert
      expect(mockGradeService.updateGrade).toHaveBeenCalledTimes(1)
      expect(useGradesStore.getState().grades).toEqual(existingGrades) // Should not change
      expect(useGradesStore.getState().isLoading).toBe(false)
      expect(useGradesStore.getState().error).toBe(errorMessage)
    })
  })
})
