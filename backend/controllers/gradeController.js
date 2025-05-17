import asyncHandler from "express-async-handler"
import Grade from "../models/gradeModel.js"
import Student from "../models/studentModel.js"

// @desc    Get grades with optional filters
// @route   GET /api/grades
// @access  Private
const getGrades = asyncHandler(async (req, res) => {
  const filters = {}

  // Apply filters if provided
  if (req.query.studentId) {
    filters.studentId = req.query.studentId
  }

  if (req.query.courseId) {
    filters.courseId = req.query.courseId
  }

  if (req.query.semester) {
    filters.semester = req.query.semester
  }

  if (req.query.academicYear) {
    filters.academicYear = req.query.academicYear
  }

  // If user is a student, only return their grades
  if (req.user.role === "STUDENT") {
    const student = await Student.findOne({ user: req.user._id })
    if (student) {
      filters.studentId = student._id
    } else {
      return res.json([])
    }
  }

  const grades = await Grade.find(filters)
  const gradesWithId = grades.map(grade => ({
    ...grade.toObject(),
    id: grade._id.toString()
  }))
  res.json(gradesWithId)
})

// @desc    Add a new grade
// @route   POST /api/grades
// @access  Private/Admin
const addGrade = asyncHandler(async (req, res) => {
  const {
    studentId,
    courseId,
    courseName,
    semester,
    academicYear,
    grade,
    letterGrade,
    creditHours,
    submissionDate,
    instructorId,
    instructorName,
    comments,
  } = req.body

  // Verify student exists
  const student = await Student.findById(studentId)
  if (!student) {
    res.status(404)
    throw new Error("Student not found")
  }

  const newGrade = await Grade.create({
    studentId,
    courseId,
    courseName,
    semester,
    academicYear,
    grade,
    letterGrade,
    creditHours,
    submissionDate,
    instructorId,
    instructorName,
    comments,
  })

  if (newGrade) {
    const gradeWithId = {
      ...newGrade.toObject(),
      id: newGrade._id.toString()
    }
    res.status(201).json(gradeWithId)
  } else {
    res.status(400)
    throw new Error("Invalid grade data")
  }
})

// @desc    Update a grade
// @route   PATCH /api/grades/:id
// @access  Private/Admin
const updateGrade = asyncHandler(async (req, res) => {
  const grade = await Grade.findById(req.params.id)

  if (grade) {
    grade.courseId = req.body.courseId || grade.courseId
    grade.courseName = req.body.courseName || grade.courseName
    grade.semester = req.body.semester || grade.semester
    grade.academicYear = req.body.academicYear || grade.academicYear
    grade.grade = req.body.grade !== undefined ? req.body.grade : grade.grade
    grade.letterGrade = req.body.letterGrade || grade.letterGrade
    grade.creditHours = req.body.creditHours !== undefined ? req.body.creditHours : grade.creditHours
    grade.submissionDate = req.body.submissionDate || grade.submissionDate
    grade.instructorId = req.body.instructorId || grade.instructorId
    grade.instructorName = req.body.instructorName || grade.instructorName
    grade.comments = req.body.comments !== undefined ? req.body.comments : grade.comments

    const updatedGrade = await grade.save()
    res.json(updatedGrade)
  } else {
    res.status(404)
    throw new Error("Grade not found")
  }
})

export { getGrades, addGrade, updateGrade }
