import express from "express"
import { getAttendance, bulkUploadAttendance } from "../controllers/attendanceController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Посещаемость
 *
 * components:
 *   schemas:
 *     Attendance:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         studentId:
 *           type: string
 *         courseId:
 *           type: string
 *         courseName:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [present, absent, late, excused]
 *         duration:
 *           type: number
 *         notes:
 *           type: string
 *           nullable: true
 *     AttendanceBulkRequest:
 *       type: object
 *       properties:
 *         records:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Attendance'
 */

/**
 * @swagger
 * /api/attendance:
 *   get:
 *     summary: Записи посещаемости (с фильтрами)
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: studentId
 *         schema:
 *           type: string
 *       - in: query
 *         name: courseId
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [present, absent, late, excused]
 *     responses:
 *       200:
 *         description: Массив записей посещаемости
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attendance'
 *       401:
 *         description: Не авторизован
 */
router.route("/").get(protect, getAttendance)

/**
 * @swagger
 * /api/attendance/bulk:
 *   post:
 *     summary: Пакетная загрузка посещаемости
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AttendanceBulkRequest'
 *     responses:
 *       201:
 *         description: Созданные записи
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attendance'
 *       400:
 *         description: Неверные данные
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав
 */
router.route("/bulk").post(protect, admin, bulkUploadAttendance)

export default router
