import express from "express"
import { getPerformanceMetrics, getAttendanceStatistics, getStudentReport } from "../controllers/analyticsController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/performance").get(protect, getPerformanceMetrics)
router.route("/attendance").get(protect, getAttendanceStatistics)
router.route("/student/:id").get(protect, getStudentReport)

export default router
