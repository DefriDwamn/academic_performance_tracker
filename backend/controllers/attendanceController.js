import asyncHandler from "express-async-handler"
import Attendance from "../models/attendanceModel.js"
import Student from "../models/studentModel.js"

// @desc    Get attendance records with optional filters
// @route   GET /api/attendance
// @access  Private
const getAttendance = asyncHandler(async (req, res) => {
  const filters = {}

  // Apply filters if provided
  if (req.query.studentId) {
    filters.studentId = req.query.studentId
  }

  if (req.query.courseId) {
    filters.courseId = req.query.courseId
  }

  if (req.query.date) {
    filters.date = req.query.date
  }

  if (req.query.status) {
    filters.status = req.query.status
  }

  // If user is a student, only return their attendance records
  if (req.user.role === "STUDENT") {
    const student = await Student.findOne({ user: req.user._id })
    if (student) {
      filters.studentId = student._id
    } else {
      return res.json([])
    }
  }

  const attendance = await Attendance.find(filters)
  res.json(attendance)
})

// @desc    Bulk upload attendance records
// @route   POST /api/attendance/bulk
// @access  Private/Admin
const bulkUploadAttendance = asyncHandler(async (req, res) => {
  const { records } = req.body

  if (!records || !Array.isArray(records) || records.length === 0) {
    res.status(400)
    throw new Error("No attendance records provided")
  }

  // Validate each record
  for (const record of records) {
    if (!record.studentId || !record.courseId || !record.courseName || !record.date || !record.status) {
      res.status(400)
      throw new Error("Invalid attendance record data")
    }

    // Verify student exists
    const student = await Student.findById(record.studentId)
    if (!student) {
      res.status(404)
      throw new Error(`Student with ID ${record.studentId} not found`)
    }
  }

  // Insert all records
  const createdRecords = await Attendance.insertMany(records)

  res.status(201).json(createdRecords)
})

export { getAttendance, bulkUploadAttendance }
