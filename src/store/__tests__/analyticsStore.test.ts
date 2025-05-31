import { beforeEach, describe, expect, it, jest } from "@jest/globals"
import { act } from "@testing-library/react"

import { AnalyticsService } from "../../services/analyticsService"
import { useAnalyticsStore } from "../analyticsStore"

// Mock the AnalyticsService
jest.mock("../../services/analyticsService", () => ({
  AnalyticsService: {
    getPerformanceMetrics: jest.fn(),
    getAttendanceStatistics: jest.fn(),
    getStudentReport: jest.fn(),
  },
}))

const mockAnalyticsService = AnalyticsService as jest.Mocked<typeof AnalyticsService>

describe("analyticsStore", () => {
  // Reset the store before each test
  beforeEach(() => {
    jest.resetAllMocks()
    act(() => {
      useAnalyticsStore.setState({
        performanceMetrics: null,
        attendanceStatistics: null,
        studentReport: null,
        isLoadingPerformance: false,
        isLoadingAttendance: false,
        isLoadingStudent: false,
        error: null,
      })
    })
  })

  describe("fetchPerformanceMetrics", () => {
    it("should fetch performance metrics successfully", async () => {
      // Mock data
      const mockMetrics = {
        averageGrade: 85,
        passingRate: 0.92,
        topPerformers: ["student1", "student2"],
        overallGPA: 3.4,
        semesterGPA: {
          "Fall 2023": 3.4,
          "Spring 2023": 3.6,
          "Fall 2022": 3.2,
        },
        coursePerformance: [
          {
            courseId: "CS101",
            courseName: "Intro to CS",
            averageGrade: 88,
            highestGrade: 98,
            lowestGrade: 72,
            gradeDistribution: [
              { letterGrade: "A", count: 15, percentage: 30 },
              { letterGrade: "B", count: 20, percentage: 40 },
              { letterGrade: "C", count: 10, percentage: 20 },
              { letterGrade: "D", count: 3, percentage: 6 },
              { letterGrade: "F", count: 2, percentage: 4 },
            ],
          },
        ],
        trendData: {
          semesters: ["Fall 2022", "Spring 2023", "Fall 2023"],
          averageGrades: [82, 85, 88],
        },
      }

      // Setup mock
      mockAnalyticsService.getPerformanceMetrics.mockResolvedValue(mockMetrics)

      // Execute
      await act(async () => {
        await useAnalyticsStore.getState().fetchPerformanceMetrics()
      })

      // Assert
      expect(mockAnalyticsService.getPerformanceMetrics).toHaveBeenCalledTimes(1)
      expect(useAnalyticsStore.getState().performanceMetrics).toEqual(mockMetrics)
      expect(useAnalyticsStore.getState().isLoadingPerformance).toBe(false)
      expect(useAnalyticsStore.getState().error).toBeNull()
    })

    it("should handle errors when fetching performance metrics", async () => {
      // Setup mock to throw error
      const errorMessage = "API error"
      mockAnalyticsService.getPerformanceMetrics.mockRejectedValue(new Error(errorMessage))

      // Execute
      await act(async () => {
        await useAnalyticsStore.getState().fetchPerformanceMetrics()
      })

      // Assert
      expect(mockAnalyticsService.getPerformanceMetrics).toHaveBeenCalledTimes(1)
      expect(useAnalyticsStore.getState().performanceMetrics).toBeNull()
      expect(useAnalyticsStore.getState().isLoadingPerformance).toBe(false)
      expect(useAnalyticsStore.getState().error).toBe(errorMessage)
    })
  })

  describe("fetchAttendanceStatistics", () => {
    it("should fetch attendance statistics successfully", async () => {
      // Mock data
      const mockStatistics = {
        averageAttendance: 0.88,
        absenteeRate: 0.12,
        mostMissedDays: ["Monday", "Friday"],
        overallAttendanceRate: 0.88,
        courseAttendance: [
          {
            courseId: "CS101",
            courseName: "Intro to CS",
            attendanceRate: 0.92,
            absenceCount: 3,
            lateCount: 2,
          },
          {
            courseId: "MATH201",
            courseName: "Calculus",
            attendanceRate: 0.84,
            absenceCount: 6,
            lateCount: 4,
          },
        ],
        monthlyAttendance: [
          { month: "2023-09", attendanceRate: 0.85 },
          { month: "2023-10", attendanceRate: 0.88 },
          { month: "2023-11", attendanceRate: 0.91 },
        ],
      }

      // Setup mock
      mockAnalyticsService.getAttendanceStatistics.mockResolvedValue(mockStatistics)

      // Execute
      await act(async () => {
        await useAnalyticsStore.getState().fetchAttendanceStatistics()
      })

      // Assert
      expect(mockAnalyticsService.getAttendanceStatistics).toHaveBeenCalledTimes(1)
      expect(useAnalyticsStore.getState().attendanceStatistics).toEqual(mockStatistics)
      expect(useAnalyticsStore.getState().isLoadingAttendance).toBe(false)
      expect(useAnalyticsStore.getState().error).toBeNull()
    })

    it("should handle errors when fetching attendance statistics", async () => {
      // Setup mock to throw error
      const errorMessage = "API error"
      mockAnalyticsService.getAttendanceStatistics.mockRejectedValue(new Error(errorMessage))

      // Execute
      await act(async () => {
        await useAnalyticsStore.getState().fetchAttendanceStatistics()
      })

      // Assert
      expect(mockAnalyticsService.getAttendanceStatistics).toHaveBeenCalledTimes(1)
      expect(useAnalyticsStore.getState().attendanceStatistics).toBeNull()
      expect(useAnalyticsStore.getState().isLoadingAttendance).toBe(false)
      expect(useAnalyticsStore.getState().error).toBe(errorMessage)
    })
  })

  describe("fetchStudentReport", () => {
    it("should fetch student report successfully", async () => {
      // Mock data
      const studentId = "student123"
      const mockReport = {
        studentId: "student123",
        overallGrade: 92,
        attendanceRate: 0.95,
        strengths: ["Math", "Science"],
        weaknesses: ["History"],
        student: {
          id: "student123",
          name: "John Doe",
          studentId: "STU123",
          program: "Computer Science",
        },
        academicPerformance: {
          currentGPA: 3.8,
          totalCredits: 45,
          completedCourses: 8,
          inProgressCourses: 5,
          gradeDistribution: [
            { letterGrade: "A", count: 5, percentage: 62.5 },
            { letterGrade: "B", count: 2, percentage: 25 },
            { letterGrade: "C", count: 1, percentage: 12.5 },
          ],
          semesterPerformance: [
            { semester: "Fall 2023", gpa: 3.8, credits: 15 },
            { semester: "Spring 2023", gpa: 3.7, credits: 15 },
            { semester: "Fall 2022", gpa: 3.6, credits: 15 },
          ],
        },
        attendanceRecord: {
          overallAttendanceRate: 0.95,
          absenceCount: 2,
          lateCount: 1,
          excusedCount: 1,
          courseAttendance: [
            {
              courseId: "CS101",
              courseName: "Intro to CS",
              attendanceRate: 0.96,
            },
            {
              courseId: "MATH201",
              courseName: "Calculus",
              attendanceRate: 0.94,
            },
          ],
        },
      }

      // Setup mock
      mockAnalyticsService.getStudentReport.mockResolvedValue(mockReport)

      // Execute
      await act(async () => {
        await useAnalyticsStore.getState().fetchStudentReport(studentId)
      })

      // Assert
      expect(mockAnalyticsService.getStudentReport).toHaveBeenCalledWith(studentId)
      expect(useAnalyticsStore.getState().studentReport).toEqual(mockReport)
      expect(useAnalyticsStore.getState().isLoadingStudent).toBe(false)
      expect(useAnalyticsStore.getState().error).toBeNull()
    })

    it("should handle errors when fetching student report", async () => {
      // Setup mock to throw error
      const studentId = "student123"
      const errorMessage = "API error"
      mockAnalyticsService.getStudentReport.mockRejectedValue(new Error(errorMessage))

      // Execute
      await act(async () => {
        await useAnalyticsStore.getState().fetchStudentReport(studentId)
      })

      // Assert
      expect(mockAnalyticsService.getStudentReport).toHaveBeenCalledWith(studentId)
      expect(useAnalyticsStore.getState().studentReport).toBeNull()
      expect(useAnalyticsStore.getState().isLoadingStudent).toBe(false)
      expect(useAnalyticsStore.getState().error).toBe(errorMessage)
    })
  })
})
