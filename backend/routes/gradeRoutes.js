import express from "express"
import { getGrades, addGrade, updateGrade } from "../controllers/gradeController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Grades
 *   description: Оценки
 *
 * components:
 *   schemas:
 *     Grade:
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
 *         semester:
 *           type: string
 *         academicYear:
 *           type: string
 *         grade:
 *           type: number
 *         letterGrade:
 *           type: string
 *         creditHours:
 *           type: number
 *         submissionDate:
 *           type: string
 *           format: date-time
 *         instructorId:
 *           type: string
 *         instructorName:
 *           type: string
 *         comments:
 *           type: string
 *           nullable: true
 */

/**
 * @swagger
 * /api/grades:
 *   get:
 *     summary: Список оценок (с фильтрами)
 *     tags: [Grades]
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
 *         name: semester
 *         schema:
 *           type: string
 *       - in: query
 *         name: academicYear
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Массив оценок
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Grade'
 *       401:
 *         description: Не авторизован
 *   post:
 *     summary: Добавить оценку
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Grade'
 *     responses:
 *       201:
 *         description: Созданная оценка
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Grade'
 *       400:
 *         description: Неверные данные
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав
 */
router.route("/").get(protect, getGrades).post(protect, admin, addGrade)

/**
 * @swagger
 * /api/grades/{id}:
 *   patch:
 *     summary: Обновить оценку
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Grade'
 *     responses:
 *       200:
 *         description: Обновленная оценка
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Grade'
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав
 *       404:
 *         description: Оценка не найдена
 */
router.route("/:id").patch(protect, admin, updateGrade)

export default router
