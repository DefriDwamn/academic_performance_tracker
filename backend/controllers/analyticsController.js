import asyncHandler from "express-async-handler"
import Grade from "../models/gradeModel.js"
import Attendance from "../models/attendanceModel.js"
import Student from "../models/studentModel.js"

// Helper function to calculate GPA
const calculateGPA = (grades) => {
  if (grades.length === 0) return 0

  const gradePoints = {
    A: 4.0,
    B: 3.0,
    C: 2.0,
    D: 1.0,
    F: 0.0,
  }

  let totalPoints = 0
  let totalCredits = 0

  grades.forEach((grade) => {
    const letterGrade = grade.letterGrade.charAt(0)
    totalPoints += (gradePoints[letterGrade] || 0) * grade.creditHours
    totalCredits += grade.creditHours
  })

  return totalCredits > 0 ? totalPoints / totalCredits : 0
}

// @desc    Get performance metrics
// @route   GET /api/analytics/performance
// @access  Private
const getPerformanceMetrics = asyncHandler(async (req, res) => {
  let studentFilter = {}

  // If user is a student, only get their metrics
  if (req.user.role === "STUDENT") {
    const student = await Student.findOne({ user: req.user._id })
    if (student) {
      studentFilter = { studentId: student._id }
    } else {
      return res.status(404).json({ message: "Student profile not found" })
    }
  }

  // Get all grades
  const grades = await Grade.find(studentFilter)

  // Calculate overall GPA
  const overallGPA = calculateGPA(grades)

  // Calculate semester GPAs
  const semesterGrades = {}
  grades.forEach((grade) => {
    const key = `${grade.semester} ${grade.academicYear}`
    if (!semesterGrades[key]) {
      semesterGrades[key] = []
    }
    semesterGrades[key].push(grade)
  })

  const semesterGPA = {}
  Object.keys(semesterGrades).forEach((semester) => {
    semesterGPA[semester] = calculateGPA(semesterGrades[semester])
  })

  // Calculate course performance
  const courseGrades = {}
  grades.forEach((grade) => {
    if (!courseGrades[grade.courseId]) {
      courseGrades[grade.courseId] = {
        courseId: grade.courseId,
        courseName: grade.courseName,
        grades: [],
      }
    }
    courseGrades[grade.courseId].grades.push(grade)
  })

  const coursePerformance = Object.values(courseGrades).map((course) => {
    const grades = course.grades.map((g) => g.grade)
    const letterGrades = course.grades.map((g) => g.letterGrade)

    // Calculate grade distribution
    const gradeDistribution = {}
    letterGrades.forEach((lg) => {
      if (!gradeDistribution[lg]) {
        gradeDistribution[lg] = 0
      }
      gradeDistribution[lg]++
    })

    const gradeDistributionArray = Object.keys(gradeDistribution).map((letterGrade) => ({
      letterGrade,
      count: gradeDistribution[letterGrade],
      percentage: (gradeDistribution[letterGrade] / letterGrades.length) * 100,
    }))

    return {
      courseId: course.courseId,
      courseName: course.courseName,
      averageGrade: grades.reduce((sum, g) => sum + g, 0) / grades.length,
      highestGrade: Math.max(...grades),
      lowestGrade: Math.min(...grades),
      gradeDistribution: gradeDistributionArray,
    }
  })

  // Calculate trend data
  const semesters = Object.keys(semesterGPA).sort()
  const trendData = {
    semesters,
    averageGrades: semesters.map((sem) => {
      const semGrades = semesterGrades[sem].map((g) => g.grade)
      return semGrades.reduce((sum, g) => sum + g, 0) / semGrades.length
    }),
  }

  res.json({
    overallGPA,
    semesterGPA,
    coursePerformance,
    trendData,
  })
})

// @desc    Get attendance statistics
// @route   GET /api/analytics/attendance
// @access  Private
const getAttendanceStatistics = asyncHandler(async (req, res) => {
  let studentFilter = {}

  // If user is a student, only get their attendance
  if (req.user.role === "STUDENT") {
    const student = await Student.findOne({ user: req.user._id })
    if (student) {
      studentFilter = { studentId: student._id }
    } else {
      return res.status(404).json({ message: "Student profile not found" })
    }
  }

  // Get all attendance records
  const attendanceRecords = await Attendance.find(studentFilter)

  // Calculate overall attendance rate
  const totalRecords = attendanceRecords.length
  const presentRecords = attendanceRecords.filter((r) => r.status === "present").length
  const overallAttendanceRate = totalRecords > 0 ? (presentRecords / totalRecords) * 100 : 0

  // Calculate course attendance
  const courseAttendance = {}
  attendanceRecords.forEach((record) => {
    if (!courseAttendance[record.courseId]) {
      courseAttendance[record.courseId] = {
        courseId: record.courseId,
        courseName: record.courseName,
        records: [],
      }
    }
    courseAttendance[record.courseId].records.push(record)
  })

  const courseAttendanceArray = Object.values(courseAttendance).map((course) => {
    const totalCourseRecords = course.records.length
    const presentCourseRecords = course.records.filter((r) => r.status === "present").length
    const lateCourseRecords = course.records.filter((r) => r.status === "late").length
    const absentCourseRecords = course.records.filter((r) => r.status === "absent").length

    return {
      courseId: course.courseId,
      courseName: course.courseName,
      attendanceRate:
        totalCourseRecords > 0 ? ((presentCourseRecords + lateCourseRecords) / totalCourseRecords) * 100 : 0,
      absenceCount: absentCourseRecords,
      lateCount: lateCourseRecords,
    }
  })

  // Calculate monthly attendance
  const monthlyAttendance = {}
  attendanceRecords.forEach((record) => {
    const date = new Date(record.date)
    const month = date.toLocaleString("default", { month: "long", year: "numeric" })

    if (!monthlyAttendance[month]) {
      monthlyAttendance[month] = {
        month,
        records: [],
      }
    }
    monthlyAttendance[month].records.push(record)
  })

  const monthlyAttendanceArray = Object.values(monthlyAttendance).map((month) => {
    const totalMonthRecords = month.records.length
    const presentMonthRecords = month.records.filter((r) => r.status === "present").length
    const lateMonthRecords = month.records.filter((r) => r.status === "late").length

    return {
      month: month.month,
      attendanceRate: totalMonthRecords > 0 ? ((presentMonthRecords + lateMonthRecords) / totalMonthRecords) * 100 : 0,
    }
  })

  res.json({
    overallAttendanceRate,
    courseAttendance: courseAttendanceArray,
    monthlyAttendance: monthlyAttendanceArray,
  })
})

// @desc    Get student report
// @route   GET /api/analytics/student/:id
// @access  Private
const getStudentReport = asyncHandler(async (req, res) => {
  let studentId = req.params.id

  // If user is a student, they can only view their own report
  if (req.user.role === "STUDENT") {
    const student = await Student.findOne({ user: req.user._id })
    if (student) {
      studentId = student._id
    } else {
      return res.status(404).json({ message: "Student profile not found" })
    }
  }

  // Get student
  const student = await Student.findById(studentId)
  if (!student) {
    res.status(404)
    throw new Error("Student not found")
  }

  // Get grades
  const grades = await Grade.find({ studentId })

  // Get attendance
  const attendanceRecords = await Attendance.find({ studentId })

  // Calculate GPA
  const currentGPA = calculateGPA(grades)

  // Calculate total credits
  const totalCredits = grades.reduce((sum, grade) => sum + grade.creditHours, 0)

  // Count completed and in-progress courses
  const uniqueCourseIds = new Set(grades.map((g) => g.courseId))
  const completedCourses = uniqueCourseIds.size
  const inProgressCourses = 0 // This would require additional data to determine

  // Calculate grade distribution
  const letterGrades = grades.map((g) => g.letterGrade)
  const gradeDistribution = {}
  letterGrades.forEach((lg) => {
    if (!gradeDistribution[lg]) {
      gradeDistribution[lg] = 0
    }
    gradeDistribution[lg]++
  })

  const gradeDistributionArray = Object.keys(gradeDistribution).map((letterGrade) => ({
    letterGrade,
    count: gradeDistribution[letterGrade],
    percentage: (gradeDistribution[letterGrade] / letterGrades.length) * 100,
  }))

  // Calculate semester performance
  const semesterGrades = {}
  grades.forEach((grade) => {
    const key = `${grade.semester} ${grade.academicYear}`
    if (!semesterGrades[key]) {
      semesterGrades[key] = {
        semester: key,
        grades: [],
        credits: 0,
      }
    }
    semesterGrades[key].grades.push(grade)
    semesterGrades[key].credits += grade.creditHours
  })

  const semesterPerformance = Object.values(semesterGrades).map((semester) => ({
    semester: semester.semester,
    gpa: calculateGPA(semester.grades),
    credits: semester.credits,
  }))

  // Calculate attendance statistics
  const totalRecords = attendanceRecords.length
  const presentRecords = attendanceRecords.filter((r) => r.status === "present").length
  const lateRecords = attendanceRecords.filter((r) => r.status === "late").length
  const absentRecords = attendanceRecords.filter((r) => r.status === "absent").length
  const excusedRecords = attendanceRecords.filter((r) => r.status === "excused").length
  const overallAttendanceRate = totalRecords > 0 ? ((presentRecords + lateRecords) / totalRecords) * 100 : 0

  // Calculate course attendance
  const courseAttendance = {}
  attendanceRecords.forEach((record) => {
    if (!courseAttendance[record.courseId]) {
      courseAttendance[record.courseId] = {
        courseId: record.courseId,
        courseName: record.courseName,
        records: [],
      }
    }
    courseAttendance[record.courseId].records.push(record)
  })

  const courseAttendanceArray = Object.values(courseAttendance).map((course) => {
    const totalCourseRecords = course.records.length
    const presentCourseRecords = course.records.filter((r) => r.status === "present").length
    const lateCourseRecords = course.records.filter((r) => r.status === "late").length

    return {
      courseId: course.courseId,
      courseName: course.courseName,
      attendanceRate:
        totalCourseRecords > 0 ? ((presentCourseRecords + lateCourseRecords) / totalCourseRecords) * 100 : 0,
    }
  })

  res.json({
    student: {
      id: student._id,
      name: `${student.firstName} ${student.lastName}`,
      studentId: student.studentId,
      program: student.program,
    },
    academicPerformance: {
      currentGPA,
      totalCredits,
      completedCourses,
      inProgressCourses,
      gradeDistribution: gradeDistributionArray,
      semesterPerformance,
    },
    attendanceRecord: {
      overallAttendanceRate,
      absenceCount: absentRecords,
      lateCount: lateRecords,
      excusedCount: excusedRecords,
      courseAttendance: courseAttendanceArray,
    },
  })
})

export { getPerformanceMetrics, getAttendanceStatistics, getStudentReport }
