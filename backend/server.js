import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import morgan from "morgan"
import connectDB from "./config/db.js"
import { errorHandler, notFound } from "./middleware/errorMiddleware.js"

// Route imports
import authRoutes from "./routes/authRoutes.js"
import studentRoutes from "./routes/studentRoutes.js"
import gradeRoutes from "./routes/gradeRoutes.js"
import attendanceRoutes from "./routes/attendanceRoutes.js"
import analyticsRoutes from "./routes/analyticsRoutes.js"

// Load env vars
dotenv.config()

// Connect to database
connectDB()

const app = express()

// Middleware
app.use(cors({
  origin: [
    'https://defridwamn.github.io',
    'https://defridwamn.github.io/academic_performance_tracker'
  ],
  credentials: true
}))
app.use(express.json())
app.use(morgan("dev"))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/students", studentRoutes)
app.use("/api/grades", gradeRoutes)
app.use("/api/attendance", attendanceRoutes)
app.use("/api/analytics", analyticsRoutes)

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
