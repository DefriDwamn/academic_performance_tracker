import express from "express"
import { getPerformanceMetrics, getAttendanceStatistics, getStudentReport } from "../controllers/analyticsController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Аналитика успеваемости и посещаемости
 */

/**
 * @swagger
 * /api/analytics/performance:
 *   get:
 *     summary: Общие метрики успеваемости
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Метрики успеваемости
 *       401:
 *         description: Не авторизован
 */
router.route("/performance").get(protect, getPerformanceMetrics)

/**
 * @swagger
 * /api/analytics/attendance:
 *   get:
 *     summary: Общая статистика посещаемости
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Статистика посещаемости
 *       401:
 *         description: Не авторизован
 */
router.route("/attendance").get(protect, getAttendanceStatistics)

/**
 * @swagger
 * /api/analytics/student/{id}:
 *   get:
 *     summary: Отчет по студенту
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Отчет по успеваемости и посещаемости студента
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Студент не найден
 */
router.route("/student/:id").get(protect, getStudentReport)

export default router
