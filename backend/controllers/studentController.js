import asyncHandler from "express-async-handler"
import Student from "../models/studentModel.js"
import User from "../models/userModel.js"
import Grade from "../models/gradeModel.js"
import Attendance from "../models/attendanceModel.js"
import mongoose from "mongoose"

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin
const getStudents = asyncHandler(async (req, res) => {
  const students = await Student.find({})
  const studentsWithId = students.map(student => ({
    ...student.toObject(),
    id: student._id.toString()
  }))
  res.json(studentsWithId)
})

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Private
const getStudentById = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id)

  if (student) {
    const studentWithId = {
      ...student.toObject(),
      id: student._id.toString()
    }
    res.json(studentWithId)
  } else {
    res.status(404)
    throw new Error("Student not found")
  }
})

// @desc    Get current student profile
// @route   GET /api/students/me
// @access  Private
const getCurrentStudent = asyncHandler(async (req, res) => {
  // If user is a student, get their student profile
  if (req.user.role === "STUDENT" && req.user.studentId) {
    const student = await Student.findById(req.user.studentId)

    if (student) {
      const studentWithId = {
        ...student.toObject(),
        id: student._id.toString()
      }
      res.json(studentWithId)
    } else {
      res.status(404)
      throw new Error("Student profile not found")
    }
  } else {
    res.status(403)
    throw new Error("Not authorized to access this resource")
  }
})

// @desc    Create a student
// @route   POST /api/students
// @access  Private/Admin
const createStudent = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    studentId,
    dateOfBirth,
    gender,
    address,
    phoneNumber,
    enrollmentDate,
    graduationDate,
    department,
    program,
    status,
  } = req.body

  // Check if student with email or studentId already exists
  const studentExists = await Student.findOne({
    $or: [{ email }, { studentId }],
  })

  if (studentExists) {
    res.status(400)
    throw new Error("Student already exists")
  }

  // Validate dates
  const dateOfBirthDate = new Date(dateOfBirth)
  const enrollmentDateDate = new Date(enrollmentDate)
  const graduationDateDate = graduationDate ? new Date(graduationDate) : null

  if (isNaN(dateOfBirthDate.getTime())) {
    res.status(400)
    throw new Error("Invalid date of birth")
  }

  if (isNaN(enrollmentDateDate.getTime())) {
    res.status(400)
    throw new Error("Invalid enrollment date")
  }

  if (graduationDate && isNaN(graduationDateDate.getTime())) {
    res.status(400)
    throw new Error("Invalid graduation date")
  }

  const student = await Student.create({
    firstName,
    lastName,
    email,
    studentId,
    dateOfBirth: dateOfBirthDate,
    gender,
    address,
    phoneNumber,
    enrollmentDate: enrollmentDateDate,
    graduationDate: graduationDateDate,
    department,
    program,
    status,
  })

  if (student) {
    // Create a user account for the student
    const user = await User.create({
      name: `${firstName} ${lastName}`,
      email,
      password: studentId, // Default password is the student ID
      role: "STUDENT",
      studentId: student._id,
    })

    // Update student with user reference
    if (user) {
      student.user = user._id
      await student.save()
    }

    const studentWithId = {
      ...student.toObject(),
      id: student._id.toString()
    }
    res.status(201).json(studentWithId)
  } else {
    res.status(400)
    throw new Error("Invalid student data")
  }
})

// @desc    Update a student
// @route   PUT /api/students/:id
// @access  Private
const updateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id)

  if (student) {
    // Check if user is admin or the student themselves
    if (
      req.user.role === "ADMINISTRATOR" ||
      (req.user.role === "STUDENT" && req.user.studentId.toString() === student._id.toString())
    ) {
      // If user is a student, they can only update certain fields
      if (req.user.role === "STUDENT") {
        student.phoneNumber = req.body.phoneNumber || student.phoneNumber
        student.address = req.body.address || student.address
      } else {
        // Admin can update all fields
        student.firstName = req.body.firstName || student.firstName
        student.lastName = req.body.lastName || student.lastName
        student.email = req.body.email || student.email
        student.studentId = req.body.studentId || student.studentId
        student.dateOfBirth = req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : student.dateOfBirth
        student.gender = req.body.gender || student.gender
        student.address = req.body.address || student.address
        student.phoneNumber = req.body.phoneNumber || student.phoneNumber
        student.enrollmentDate = req.body.enrollmentDate ? new Date(req.body.enrollmentDate) : student.enrollmentDate
        student.graduationDate = req.body.graduationDate ? new Date(req.body.graduationDate) : student.graduationDate
        student.department = req.body.department || student.department
        student.program = req.body.program || student.program
        student.status = req.body.status || student.status

        // If email was updated, also update the associated user's email
        if (req.body.email && req.body.email !== student.email && student.user) {
          await User.findByIdAndUpdate(student.user, { 
            email: req.body.email,
            name: `${student.firstName} ${student.lastName}`
          })
        }
      }

      const updatedStudent = await student.save()
      const studentWithId = {
        ...updatedStudent.toObject(),
        id: updatedStudent._id.toString()
      }
      res.json(studentWithId)
    } else {
      res.status(403)
      throw new Error("Not authorized to update this student")
    }
  } else {
    res.status(404)
    throw new Error("Student not found")
  }
})

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Private/Admin
const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id)

  if (student) {
    try {
      // Delete associated user account
      if (student.user) {
        await User.findByIdAndDelete(student.user)
      }

      // Delete all grades for this student
      const gradesResult = await Grade.deleteMany({ 
        studentId: new mongoose.Types.ObjectId(student._id) 
      })

      // Delete all attendance records for this student
      const attendanceResult = await Attendance.deleteMany({ 
        studentId: new mongoose.Types.ObjectId(student._id) 
      })

      // Finally delete the student
      await Student.findByIdAndDelete(req.params.id)

      res.json({ message: "Student and all related records removed" })
    } catch (error) {
      res.status(500)
      throw new Error(`Failed to delete student and related records: ${error.message}`)
    }
  } else {
    res.status(404)
    throw new Error("Student not found")
  }
})

export { getStudents, getStudentById, getCurrentStudent, createStudent, updateStudent, deleteStudent }
