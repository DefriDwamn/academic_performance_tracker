import api, { handleApiError } from "./api"
import type { Student } from "../types/student"

export const StudentService = {
  async getStudents(): Promise<Student[]> {
    try {
      const response = await api.get<Student[]>("/students")
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async getStudentById(id: string): Promise<Student> {
    try {
      const response = await api.get<Student>(`/students/${id}`)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async getCurrentStudent(): Promise<Student> {
    try {
      const response = await api.get<Student>("/students/me")
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async createStudent(student: Omit<Student, "id">): Promise<Student> {
    try {
      const response = await api.post<Student>("/students", student)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async updateStudent(id: string, student: Partial<Student>): Promise<Student> {
    try {
      const response = await api.put<Student>(`/students/${id}`, student)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async deleteStudent(id: string): Promise<void> {
    try {
      await api.delete(`/students/${id}`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },
}
