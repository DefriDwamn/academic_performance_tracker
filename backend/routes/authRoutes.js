import express from "express"
import { loginUser, refreshToken, validateToken } from "../controllers/authController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/login", loginUser)
router.post("/refresh", refreshToken)
router.get("/validate", protect, validateToken)

export default router
