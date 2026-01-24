import { Router } from "express";
import { clerkService } from "../controllers/clerk.controller.js";

const router = Router();

router.post('clerk', clerkService)

export default router