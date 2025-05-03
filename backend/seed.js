import dotenv from "dotenv"
import bcrypt from "bcryptjs"
import User from "./models/userModel.js"
import Student from "./models/studentModel.js"
import Grade from "./models/gradeModel.js"
import Attendance from "./models/attendanceModel.js"
import connectDB from "./config/db.js"

dotenv.config()
connectDB()

const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany()
    await Student.deleteMany()
    await Grade.deleteMany()
    await Attendance.deleteMany()

    console.log("Data cleared...")

    // Create admin user
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      role: "ADMINISTRATOR",
    })

    console.log("Admin user created...")

    // Create students
    const students = []
    const studentUsers = []

    for (let i = 1; i <= 10; i++) {
      const studentUser = await User.create({
        name: `Student ${i}`,
        email: `student${i}@example.com`,
        password: "password123",
        role: "STUDENT",
      })

      studentUsers.push(studentUser)

      const student = await Student.create({
        firstName: `Student`,
        lastName: `${i}`,
        email: `student${i}@example.com`,
        studentId: `ST${100000 + i}`,
        dateOfBirth: new Date(1995, 0, i),
        gender: i % 2 === 0 ? "male" : "female",
        address: `123 Main St, Apt ${i}, Cityville, State`,
        phoneNumber: `555-123-${1000 + i}`,
        enrollmentDate: new Date(2022, 8, 1), // September 1, 2022
        department: i % 3 === 0 ? "computer_science" : i % 3 === 1 ? "engineering" : "business",
        program: i % 2 === 0 ? "bachelor" : "master",
        status: "active",
        user: studentUser._id,
      })

      students.push(student)

      // Update student user with student ID
      studentUser.studentId = student._id
      await studentUser.save()
    }

    console.log("Students created...")

    // Create courses
    const courses = [
      { id: "CS101", name: "Introduction to Computer Science" },
      { id: "CS201", name: "Data Structures and Algorithms" },
      { id: "MATH101", name: "Calculus I" },
      { id: "ENG101", name: "English Composition" },
      { id: "PHYS101", name: "Physics I" },
    ]

    // Create instructors
    const instructors = [
      { id: "INS001", name: "Dr. John Smith" },
      { id: "INS002", name: "Prof. Jane Doe" },
      { id: "INS003", name: "Dr. Robert Johnson" },
    ]

    // Create grades
    const grades = []
    const semesters = ["Fall", "Spring", "Summer"]
    const academicYears = ["2022-2023", "2023-2024"]
    const letterGrades = ["A", "B", "C", "D", "F"]

    for (const student of students) {
      for (const course of courses) {
        if (Math.random() > 0.3) {
          // 70% chance of having a grade for each course
          const semester = semesters[Math.floor(Math.random() * semesters.length)]
          const academicYear = academicYears[Math.floor(Math.random() * academicYears.length)]
          const numericGrade = Math.floor(Math.random() * 40) + 60 // 60-100
          const letterGradeIndex = Math.min(Math.floor((100 - numericGrade) / 10), 4)
          const instructor = instructors[Math.floor(Math.random() * instructors.length)]

          const grade = await Grade.create({
            studentId: student._id,
            courseId: course.id,
            courseName: course.name,
            semester,
            academicYear,
            grade: numericGrade,
            letterGrade: letterGrades[letterGradeIndex],
            creditHours: Math.floor(Math.random() * 2) + 3, // 3-4
            submissionDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
            instructorId: instructor.id,
            instructorName: instructor.name,
            comments: Math.random() > 0.7 ? "Good work!" : "",
          })

          grades.push(grade)
        }
      }
    }

    console.log("Grades created...")

    // Create attendance records
    const attendanceStatuses = ["present", "absent", "late", "excused"]
    const attendanceRecords = []

    for (const student of students) {
      for (const course of courses) {
        // Create attendance for the last 30 days
        for (let i = 0; i < 30; i++) {
          if (Math.random() > 0.2) {
            // 80% chance of having an attendance record
            const date = new Date()
            date.setDate(date.getDate() - i)

            // Weighted status (more likely to be present)
            const statusRandom = Math.random()
            let status
            if (statusRandom < 0.8) {
              status = "present"
            } else if (statusRandom < 0.9) {
              status = "late"
            } else if (statusRandom < 0.95) {
              status = "absent"
            } else {
              status = "excused"
            }

            const attendance = await Attendance.create({
              studentId: student._id,
              courseId: course.id,
              courseName: course.name,
              date,
              status,
              duration: status === "present" ? 60 : status === "late" ? 45 : 0,
              notes: status === "excused" ? "Medical appointment" : "",
            })

            attendanceRecords.push(attendance)
          }
        }
      }
    }

    console.log("Attendance records created...")

    console.log("Data import complete!")
    process.exit()
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await User.deleteMany()
    await Student.deleteMany()
    await Grade.deleteMany()
    await Attendance.deleteMany()

    console.log("Data destroyed!")
    process.exit()
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

if (process.argv[2] === "-d") {
  destroyData()
} else {
  importData()
}
