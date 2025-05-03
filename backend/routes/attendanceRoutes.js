import express from "express"
import { getAttendance, bulkUploadAttendance } from "../controllers/attendanceController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/").get(protect, getAttendance)
router.route("/bulk").post(protect, admin, bulkUploadAttendance)

export default router
