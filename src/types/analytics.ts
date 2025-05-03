export interface GradeDistribution {
  letterGrade: string
  count: number
  percentage: number
}

export interface CoursePerformance {
  courseId: string
  courseName: string
  averageGrade: number
  highestGrade: number
  lowestGrade: number
  gradeDistribution: GradeDistribution[]
}

export interface PerformanceMetrics {
  overallGPA: number
  semesterGPA: Record<string, number>
  coursePerformance: CoursePerformance[]
  trendData: {
    semesters: string[]
    averageGrades: number[]
  }
}

export interface AttendanceStatistics {
  overallAttendanceRate: number
  courseAttendance: {
    courseId: string
    courseName: string
    attendanceRate: number
    absenceCount: number
    lateCount: number
  }[]
  monthlyAttendance: {
    month: string
    attendanceRate: number
  }[]
}

export interface StudentReport {
  student: {
    id: string
    name: string
    studentId: string
    program: string
  }
  academicPerformance: {
    currentGPA: number
    totalCredits: number
    completedCourses: number
    inProgressCourses: number
    gradeDistribution: GradeDistribution[]
    semesterPerformance: {
      semester: string
      gpa: number
      credits: number
    }[]
  }
  attendanceRecord: {
    overallAttendanceRate: number
    absenceCount: number
    lateCount: number
    excusedCount: number
    courseAttendance: {
      courseId: string
      courseName: string
      attendanceRate: number
    }[]
  }
}
