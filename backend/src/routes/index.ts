import { Router } from "express";
import { TaskController } from "../controllers/TaskController";
import { TestController } from "../controllers/TestController";

const router = Router();

// health check endpoint
router.get("/health", TestController.healthCheck);

// get tasks
router.get("/tasks", (req, res) => {
  TaskController.getTasks(req, res);
});

// create task
router.post("/tasks", (req, res) => {
  TaskController.createTask(req, res);
});

// update task
router.put("/tasks", (req, res) => {
  TaskController.updateTask(req, res);
});

// delete task
router.delete("/tasks", (req, res) => {
  TaskController.deleteTask(req, res);
});

export default router;
