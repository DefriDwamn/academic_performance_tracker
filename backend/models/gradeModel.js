import mongoose from "mongoose"

const gradeSchema = mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    courseId: {
      type: String,
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    grade: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    letterGrade: {
      type: String,
      required: true,
    },
    creditHours: {
      type: Number,
      required: true,
      min: 0,
    },
    submissionDate: {
      type: Date,
      required: true,
    },
    instructorId: {
      type: String,
      required: true,
    },
    instructorName: {
      type: String,
      required: true,
    },
    comments: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

const Grade = mongoose.model("Grade", gradeSchema)

export default Grade
