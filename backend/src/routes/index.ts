import e, { Router } from "express";
import { TaskController } from "../controllers/TaskController";
import { TestController } from "../controllers/TestController";

const router = Router();

// health check endpoint
router.get("/health", TestController.healthCheck);

// get tasks
router.get("/tasks", TaskController.getTasks);

export default router;
