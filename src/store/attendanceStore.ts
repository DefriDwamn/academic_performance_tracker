import { create } from "zustand"
import { AttendanceService } from "../services/attendanceService"
import type { Attendance } from "../types/attendance"

interface AttendanceState {
  attendanceRecords: Attendance[]
  isLoading: boolean
  error: string | null
  fetchAttendance: (filters?: Record<string, any>) => Promise<void>
  bulkUploadAttendance: (records: Omit<Attendance, "_id">[]) => Promise<void>
}

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  attendanceRecords: [],
  isLoading: false,
  error: null,
  fetchAttendance: async (filters = {}) => {
    set({ isLoading: true, error: null })
    try {
      const attendanceRecords = await AttendanceService.getAttendance(filters)
      set({ attendanceRecords, isLoading: false })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch attendance",
      })
    }
  },
  bulkUploadAttendance: async (records) => {
    set({ isLoading: true, error: null })
    try {
      const newRecords = await AttendanceService.bulkUploadAttendance(records)
      set({
        attendanceRecords: [...get().attendanceRecords, ...newRecords],
        isLoading: false,
      })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to upload attendance",
      })
    }
  },
}))
