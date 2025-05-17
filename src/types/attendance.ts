export interface Attendance {
  _id: string
  studentId: string
  courseId: string
  courseName: string
  date: string
  status: "present" | "absent" | "late" | "excused"
  duration?: number
  notes?: string
}
