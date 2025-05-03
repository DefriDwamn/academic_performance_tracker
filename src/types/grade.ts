export interface Grade {
  id: string
  studentId: string
  courseId: string
  courseName: string
  semester: string
  academicYear: string
  grade: number
  letterGrade: string
  creditHours: number
  submissionDate: string
  instructorId: string
  instructorName: string
  comments?: string
}
