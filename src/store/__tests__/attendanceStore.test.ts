import { beforeEach, describe, expect, it, jest } from "@jest/globals"
import { act } from "@testing-library/react"

import { AttendanceService } from "../../services/attendanceService"
import { useAttendanceStore } from "../attendanceStore"
import type { Attendance } from "../../types/attendance"

// Mock the AttendanceService
jest.mock("../../services/attendanceService", () => ({
  AttendanceService: {
    getAttendance: jest.fn(),
    bulkUploadAttendance: jest.fn(),
  },
}))

const mockAttendanceService = AttendanceService as jest.Mocked<typeof AttendanceService>

describe("attendanceStore", () => {
  // Reset the store before each test
  beforeEach(() => {
    jest.resetAllMocks()
    act(() => {
      useAttendanceStore.setState({
        attendanceRecords: [],
        isLoading: false,
        error: null,
      })
    })
  })

  describe("fetchAttendance", () => {
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
      mockAttendanceService.getAttendance.mockResolvedValue(mockAttendance)

      // Execute
      await act(async () => {
        await useAttendanceStore.getState().fetchAttendance()
      })

      // Assert
      expect(mockAttendanceService.getAttendance).toHaveBeenCalledTimes(1)
      expect(mockAttendanceService.getAttendance).toHaveBeenCalledWith({})
      expect(useAttendanceStore.getState().attendanceRecords).toEqual(mockAttendance)
      expect(useAttendanceStore.getState().isLoading).toBe(false)
      expect(useAttendanceStore.getState().error).toBeNull()
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
      mockAttendanceService.getAttendance.mockResolvedValue(mockAttendance)

      // Execute
      await act(async () => {
        await useAttendanceStore.getState().fetchAttendance(filters)
      })

      // Assert
      expect(mockAttendanceService.getAttendance).toHaveBeenCalledTimes(1)
      expect(mockAttendanceService.getAttendance).toHaveBeenCalledWith(filters)
      expect(useAttendanceStore.getState().attendanceRecords).toEqual(mockAttendance)
    })

    it("should handle errors when fetching attendance", async () => {
      // Setup mock to throw error
      const errorMessage = "API error"
      mockAttendanceService.getAttendance.mockRejectedValue(new Error(errorMessage))

      // Execute
      await act(async () => {
        await useAttendanceStore.getState().fetchAttendance()
      })

      // Assert
      expect(mockAttendanceService.getAttendance).toHaveBeenCalledTimes(1)
      expect(useAttendanceStore.getState().attendanceRecords).toEqual([])
      expect(useAttendanceStore.getState().isLoading).toBe(false)
      expect(useAttendanceStore.getState().error).toBe(errorMessage)
    })
  })

  describe("bulkUploadAttendance", () => {
    it("should upload attendance records in bulk successfully", async () => {
      // Mock data
      const newRecords: Omit<Attendance, "_id">[] = [
        {
          studentId: "student3",
          courseId: "course2",
          courseName: "Science",
          date: "2023-05-02",
          status: "present",
        },
        {
          studentId: "student4",
          courseId: "course2",
          courseName: "Science",
          date: "2023-05-02",
          status: "absent",
        },
      ]

      const returnedRecords: Attendance[] = [
        {
          _id: "3",
          studentId: "student3",
          courseId: "course2",
          courseName: "Science",
          date: "2023-05-02",
          status: "present",
        },
        {
          _id: "4",
          studentId: "student4",
          courseId: "course2",
          courseName: "Science",
          date: "2023-05-02",
          status: "absent",
        },
      ]

      // Setup initial state with existing records
      const existingRecords: Attendance[] = [
        {
          _id: "1",
          studentId: "student1",
          courseId: "course1",
          courseName: "Math",
          date: "2023-05-01",
          status: "present",
        },
      ]

      act(() => {
        useAttendanceStore.setState({
          attendanceRecords: existingRecords,
          isLoading: false,
          error: null,
        })
      })

      // Setup mock
      mockAttendanceService.bulkUploadAttendance.mockResolvedValue(returnedRecords)

      // Execute
      await act(async () => {
        await useAttendanceStore.getState().bulkUploadAttendance(newRecords)
      })

      // Assert
      expect(mockAttendanceService.bulkUploadAttendance).toHaveBeenCalledTimes(1)
      expect(mockAttendanceService.bulkUploadAttendance).toHaveBeenCalledWith(newRecords)
      expect(useAttendanceStore.getState().attendanceRecords).toEqual([...existingRecords, ...returnedRecords])
      expect(useAttendanceStore.getState().isLoading).toBe(false)
      expect(useAttendanceStore.getState().error).toBeNull()
    })

    it("should handle errors when uploading attendance in bulk", async () => {
      // Mock data
      const newRecords: Omit<Attendance, "_id">[] = [
        {
          studentId: "student3",
          courseId: "course2",
          courseName: "Science",
          date: "2023-05-02",
          status: "present",
        },
      ]

      // Setup initial state
      const existingRecords: Attendance[] = [
        {
          _id: "1",
          studentId: "student1",
          courseId: "course1",
          courseName: "Math",
          date: "2023-05-01",
          status: "present",
        },
      ]

      act(() => {
        useAttendanceStore.setState({
          attendanceRecords: existingRecords,
          isLoading: false,
          error: null,
        })
      })

      // Setup mock to throw error
      const errorMessage = "API error"
      mockAttendanceService.bulkUploadAttendance.mockRejectedValue(new Error(errorMessage))

      // Execute
      await act(async () => {
        await useAttendanceStore.getState().bulkUploadAttendance(newRecords)
      })

      // Assert
      expect(mockAttendanceService.bulkUploadAttendance).toHaveBeenCalledTimes(1)
      expect(useAttendanceStore.getState().attendanceRecords).toEqual(existingRecords) // Should not change
      expect(useAttendanceStore.getState().isLoading).toBe(false)
      expect(useAttendanceStore.getState().error).toBe(errorMessage)
    })
  })
})
