import express from "express"
import { getGrades, addGrade, updateGrade } from "../controllers/gradeController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/").get(protect, getGrades).post(protect, admin, addGrade)

router.route("/:id").patch(protect, admin, updateGrade)

export default router
