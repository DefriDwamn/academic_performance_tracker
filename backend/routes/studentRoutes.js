import express from "express"
import {
  getStudents,
  getStudentById,
  getCurrentStudent,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/").get(protect, admin, getStudents).post(protect, admin, createStudent)

router.route("/me").get(protect, getCurrentStudent)

router.route("/:id").get(protect, getStudentById).put(protect, updateStudent).delete(protect, admin, deleteStudent)

export default router
