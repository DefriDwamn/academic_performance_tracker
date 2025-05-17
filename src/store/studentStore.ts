import { create } from 'zustand'
import { StudentService } from '../services/studentService'
import type { Student } from '../types/student'
import type { StudentFormData } from '../components/forms/StudentForm'

interface StudentState {
  students: Student[]
  currentStudent: Student | null
  isLoading: boolean
  error: string | null
  fetchStudents: () => Promise<void>
  fetchStudentById: (id: string) => Promise<void>
  fetchCurrentStudent: () => Promise<void>
  createStudent: (student: StudentFormData) => Promise<void>
  updateStudent: (id: string, student: Partial<Student>) => Promise<void>
  deleteStudent: (id: string) => Promise<void>
}

export const useStudentStore = create<StudentState>((set, get) => ({
  students: [],
  currentStudent: null,
  isLoading: false,
  error: null,
  fetchStudents: async () => {
    set({ isLoading: true, error: null })
    try {
      const students = await StudentService.getStudents()
      set({ students, isLoading: false })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch students',
      })
    }
  },
  fetchStudentById: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const student = await StudentService.getStudentById(id)
      set({ currentStudent: student, isLoading: false })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch student',
      })
    }
  },
  fetchCurrentStudent: async () => {
    set({ isLoading: true, error: null })
    try {
      const student = await StudentService.getCurrentStudent()
      set({ currentStudent: student, isLoading: false })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch current student',
      })
    }
  },
  createStudent: async (student) => {
    set({ isLoading: true, error: null })
    try {
      const newStudent = await StudentService.createStudent(student)
      set({
        students: [...get().students, newStudent],
        isLoading: false,
      })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create student',
      })
    }
  },
  updateStudent: async (id, student) => {
    set({ isLoading: true, error: null })
    try {
      const updatedStudent = await StudentService.updateStudent(id, student)
      set({
        students: get().students.map((s) => (s.id === id ? updatedStudent : s)),
        currentStudent: get().currentStudent?.id === id ? updatedStudent : get().currentStudent,
        isLoading: false,
      })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update student',
      })
    }
  },
  deleteStudent: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await StudentService.deleteStudent(id)
      set({
        students: get().students.filter((s) => s.id !== id),
        isLoading: false,
      })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to delete student',
      })
    }
  },
}))
