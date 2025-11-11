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

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Управление студентами
 *
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         studentId:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *           format: date-time
 *         gender:
 *           type: string
 *         address:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         enrollmentDate:
 *           type: string
 *           format: date-time
 *         graduationDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         department:
 *           type: string
 *         program:
 *           type: string
 *         status:
 *           type: string
 *           enum: [active, inactive, graduated, suspended]
 *         avatar:
 *           type: string
 *           nullable: true
 *         user:
 *           type: string
 *           nullable: true
 */

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Список студентов
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Массив студентов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав
 *   post:
 *     summary: Создать студента
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       201:
 *         description: Созданный студент
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         description: Неверные данные
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав
 */
router.route("/").get(protect, admin, getStudents).post(protect, admin, createStudent)

/**
 * @swagger
 * /api/students/me:
 *   get:
 *     summary: Профиль текущего студента
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Данные студента
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав
 */
router.route("/me").get(protect, getCurrentStudent)

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Получить студента по ID
 *     tags: [Students]
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
 *         description: Данные студента
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Студент не найден
 *   put:
 *     summary: Обновить студента
 *     tags: [Students]
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
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: Обновленные данные студента
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав
 *       404:
 *         description: Студент не найден
 *   delete:
 *     summary: Удалить студента
 *     tags: [Students]
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
 *         description: Успешное удаление
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав
 *       404:
 *         description: Студент не найден
 */
router.route("/:id").get(protect, getStudentById).put(protect, updateStudent).delete(protect, admin, deleteStudent)

export default router
