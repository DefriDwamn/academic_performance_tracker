import { beforeEach, describe, expect, it, jest } from "@jest/globals"
import { AttendanceService } from "../attendanceService"
import api, { handleApiError } from "../api"
import type { Attendance } from "../../types/attendance"

// Mock the api module
jest.mock("../api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
  handleApiError: jest.fn((error: unknown) => (error as Error).message || "Unknown error"),
}))

const mockApi = api as jest.Mocked<typeof api>
const mockHandleApiError = handleApiError as jest.MockedFunction<typeof handleApiError>

describe("AttendanceService", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe("getAttendance", () => {
    it("should fetch attendance records successfully", async () => {
      // Mock data
      const mockAttendance: Attendance[] = [
        {
          _id: "1",
          studentId: "student1",
          courseId: "course1",
          courseName: "Math",
          date: "2023-05-01",
          status: "present",
        },
        {
          _id: "2",
          studentId: "student2",
          courseId: "course1",
          courseName: "Math",
          date: "2023-05-01",
          status: "absent",
        },
      ]

      // Setup mock
      mockApi.get.mockResolvedValue({
        data: mockAttendance,
      })

      // Execute
      const result = await AttendanceService.getAttendance()

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith("/attendance", { params: {} })
      expect(result).toEqual(mockAttendance)
    })

    it("should fetch attendance with filters", async () => {
      // Mock data
      const mockAttendance: Attendance[] = [
        {
          _id: "1",
          studentId: "student1",
          courseId: "course1",
          courseName: "Math",
          date: "2023-05-01",
          status: "present",
        },
      ]

      const filters = { courseId: "course1", date: "2023-05-01" }

      // Setup mock
      mockApi.get.mockResolvedValue({
        data: mockAttendance,
      })

      // Execute
      const result = await AttendanceService.getAttendance(filters)

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith("/attendance", { params: filters })
      expect(result).toEqual(mockAttendance)
    })

    it("should handle errors when fetching attendance", async () => {
      // Setup mock to throw error
      const errorMessage = "Network error"
      const error = new Error(errorMessage)
      mockApi.get.mockRejectedValue(error)
      mockHandleApiError.mockReturnValue(errorMessage)

      // Execute and assert
      await expect(AttendanceService.getAttendance()).rejects.toThrow(errorMessage)
      expect(mockApi.get).toHaveBeenCalledWith("/attendance", { params: {} })
    })
  })

  describe("bulkUploadAttendance", () => {
    it("should upload attendance records in bulk successfully", async () => {
      // Mock data
      const records: Omit<Attendance, "_id">[] = [
        {
          studentId: "student1",
          courseId: "course2",
          courseName: "Science",
          date: "2023-05-02",
          status: "present",
        },
        {
          studentId: "student2",
          courseId: "course2",
          courseName: "Science",
          date: "2023-05-02",
          status: "absent",
        },
      ]

      const returnedRecords: Attendance[] = [
        {
          _id: "3",
          studentId: "student1",
          courseId: "course2",
          courseName: "Science",
          date: "2023-05-02",
          status: "present",
        },
        {
          _id: "4",
          studentId: "student2",
          courseId: "course2",
          courseName: "Science",
          date: "2023-05-02",
          status: "absent",
        },
      ]

      // Setup mock
      mockApi.post.mockResolvedValue({
        data: returnedRecords,
      })

      // Execute
      const result = await AttendanceService.bulkUploadAttendance(records)

      // Assert
      expect(mockApi.post).toHaveBeenCalledWith("/attendance/bulk", { records })
      expect(result).toEqual(returnedRecords)
    })

    it("should handle errors when uploading attendance in bulk", async () => {
      // Mock data
      const records: Omit<Attendance, "_id">[] = [
        {
          studentId: "student1",
          courseId: "course2",
          courseName: "Science",
          date: "2023-05-02",
          status: "present",
        },
      ]

      // Setup mock to throw error
      const errorMessage = "Network error"
      const error = new Error(errorMessage)
      mockApi.post.mockRejectedValue(error)
      mockHandleApiError.mockReturnValue(errorMessage)

      // Execute and assert
      await expect(AttendanceService.bulkUploadAttendance(records)).rejects.toThrow(errorMessage)
      expect(mockApi.post).toHaveBeenCalledWith("/attendance/bulk", { records })
    })
  })
})
