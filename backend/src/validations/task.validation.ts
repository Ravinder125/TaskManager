import { body } from "express-validator";

export const createTaskSchema = [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("todoList").isArray({ min: 1 }).withMessage("Todo must contain at least one item"),
    body("assignedTo").isArray({ min: 1 }).withMessage("Task is yet not assigned to anyone"),
    body("attachments").optional().isArray().withMessage("Attachments must be a array"),
    body("dueTo").optional().isISO8601().withMessage("Due date must be a valid date"),
    body("priority").isIn(["high", "medium", "low"]).withMessage("Priority options can be HIGH, MEDIUM and LOW")
]