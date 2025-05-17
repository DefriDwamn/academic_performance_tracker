import api, { handleApiError } from './api'
import type { Attendance } from '../types/attendance'

export const AttendanceService = {
  async getAttendance(filters: Record<string, any> = {}): Promise<Attendance[]> {
    try {
      const response = await api.get<Attendance[]>('/attendance', { params: filters })
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async bulkUploadAttendance(records: Omit<Attendance, '_id'>[]): Promise<Attendance[]> {
    try {
      const response = await api.post<Attendance[]>('/attendance/bulk', { records })
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },
}
