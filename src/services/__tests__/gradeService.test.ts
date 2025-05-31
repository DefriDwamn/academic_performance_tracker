import { beforeEach, describe, expect, it, jest } from "@jest/globals"
import { GradeService } from "../gradeService"
import api, { handleApiError } from "../api"
import type { Grade } from "../../types/grade"

// Mock the api module
jest.mock("../api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
  },
  handleApiError: jest.fn((error: unknown) => (error as Error).message || "Unknown error"),
}))

const mockApi = api as jest.Mocked<typeof api>
const mockHandleApiError = handleApiError as jest.MockedFunction<typeof handleApiError>

describe("GradeService", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe("getGrades", () => {
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
      ]

      // Setup mock
      mockApi.get.mockResolvedValue({ data: mockGrades })

      // Execute
      const result = await GradeService.getGrades()

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith("/grades", { params: {} })
      expect(result).toEqual(mockGrades)
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
      mockApi.get.mockResolvedValue({ data: mockGrades })

      // Execute
      const result = await GradeService.getGrades(filters)

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith("/grades", { params: filters })
      expect(result).toEqual(mockGrades)
    })

    it("should handle errors when fetching grades", async () => {
      // Setup mock to throw error
      const errorMessage = "API error"
      const error = new Error(errorMessage)
      mockApi.get.mockRejectedValue(error)
      mockHandleApiError.mockReturnValue(errorMessage)

      // Execute and assert
      await expect(GradeService.getGrades()).rejects.toThrow(errorMessage)
      expect(mockApi.get).toHaveBeenCalledWith("/grades", { params: {} })
    })
  })

  describe("addGrade", () => {
    it("should add a grade successfully", async () => {
      // Mock data
      const newGrade: Omit<Grade, "id"> = {
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
      }

      const createdGrade: Grade = {
        id: "1",
        ...newGrade,
      }

      // Setup mock
      mockApi.post.mockResolvedValue({ data: createdGrade })

      // Execute
      const result = await GradeService.addGrade(newGrade)

      // Assert
      expect(mockApi.post).toHaveBeenCalledWith("/grades", newGrade)
      expect(result).toEqual(createdGrade)
    })

    it("should handle errors when adding a grade", async () => {
      // Mock data
      const newGrade: Omit<Grade, "id"> = {
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
      }

      // Setup mock to throw error
      const errorMessage = "Validation error"
      const error = new Error(errorMessage)
      mockApi.post.mockRejectedValue(error)
      mockHandleApiError.mockReturnValue(errorMessage)

      // Execute and assert
      await expect(GradeService.addGrade(newGrade)).rejects.toThrow(errorMessage)
      expect(mockApi.post).toHaveBeenCalledWith("/grades", newGrade)
    })
  })

  describe("updateGrade", () => {
    it("should update a grade successfully", async () => {
      // Mock data
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
        grade: 90,
        letterGrade: "A-",
        creditHours: 3,
        submissionDate: "2023-05-01",
        instructorId: "instructor1",
        instructorName: "Dr. Smith",
      }

      // Setup mock
      mockApi.patch.mockResolvedValue({ data: updatedGrade })

      // Execute
      const result = await GradeService.updateGrade(gradeId, gradeUpdate)

      // Assert
      expect(mockApi.patch).toHaveBeenCalledWith(`/grades/${gradeId}`, gradeUpdate)
      expect(result).toEqual(updatedGrade)
    })

    it("should handle errors when updating a grade", async () => {
      // Mock data
      const gradeId = "1"
      const gradeUpdate: Partial<Grade> = {
        grade: 90,
        letterGrade: "A-",
      }

      // Setup mock to throw error
      const errorMessage = "Grade not found"
      const error = new Error(errorMessage)
      mockApi.patch.mockRejectedValue(error)
      mockHandleApiError.mockReturnValue(errorMessage)

      // Execute and assert
      await expect(GradeService.updateGrade(gradeId, gradeUpdate)).rejects.toThrow(errorMessage)
      expect(mockApi.patch).toHaveBeenCalledWith(`/grades/${gradeId}`, gradeUpdate)
    })
  })
})
