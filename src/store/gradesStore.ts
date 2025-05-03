import { create } from "zustand"
import { GradeService } from "../services/gradeService"
import type { Grade } from "../types/grade"

interface GradesState {
  grades: Grade[]
  isLoading: boolean
  error: string | null
  fetchGrades: (filters?: Record<string, any>) => Promise<void>
  addGrade: (grade: Omit<Grade, "id">) => Promise<void>
  updateGrade: (id: string, grade: Partial<Grade>) => Promise<void>
}

export const useGradesStore = create<GradesState>((set, get) => ({
  grades: [],
  isLoading: false,
  error: null,
  fetchGrades: async (filters = {}) => {
    set({ isLoading: true, error: null })
    try {
      const grades = await GradeService.getGrades(filters)
      set({ grades, isLoading: false })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch grades",
      })
    }
  },
  addGrade: async (grade) => {
    set({ isLoading: true, error: null })
    try {
      const newGrade = await GradeService.addGrade(grade)
      set({
        grades: [...get().grades, newGrade],
        isLoading: false,
      })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to add grade",
      })
    }
  },
  updateGrade: async (id, grade) => {
    set({ isLoading: true, error: null })
    try {
      const updatedGrade = await GradeService.updateGrade(id, grade)
      set({
        grades: get().grades.map((g) => (g.id === id ? updatedGrade : g)),
        isLoading: false,
      })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to update grade",
      })
    }
  },
}))
