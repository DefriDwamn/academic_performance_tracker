import api, { handleApiError } from "./api"
import type { Grade } from "../types/grade"

export const GradeService = {
  async getGrades(filters: Record<string, any> = {}): Promise<Grade[]> {
    try {
      const response = await api.get<Grade[]>("/grades", { params: filters })
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async addGrade(grade: Omit<Grade, "id">): Promise<Grade> {
    try {
      const response = await api.post<Grade>("/grades", grade)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async updateGrade(id: string, grade: Partial<Grade>): Promise<Grade> {
    try {
      const response = await api.patch<Grade>(`/grades/${id}`, grade)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },
}
