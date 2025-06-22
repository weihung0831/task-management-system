import { Request, Response } from "express";
import { TaskService } from "../services/TaskService";
import { TaskResponse } from "../types/index";
import { z } from "zod";

export class TaskController {
  private static taskService = new TaskService();

  static async getTasks(req: Request, res: Response) {
    try {
      const validate = z.object({
        userId: z
          .string()
          .transform((val) => parseInt(val))
          .refine((val) => !isNaN(val) && val > 0, {
            message: "userId 必須為正整數",
          })
          .optional()
          .nullable(),
      });

      const result = validate.safeParse(req.query);
      if (!result.success) {
        const response: TaskResponse = {
          success: false,
          message: "無效的請求參數",
          error: result.error.issues.map((err) => err.message).join(", "),
        };
        return res.status(400).json(response);
      }

      const tasks = await TaskController.taskService.getTasks({
        userId: result.data.userId ? result.data.userId : undefined,
      });

      const response: TaskResponse = {
        success: true,
        message: result.data.userId
          ? "取得任務列表成功"
          : "取得所有任務列表成功",
        data: tasks,
      };

      return res.status(200).json(response);
    } catch (error) {
      const response: TaskResponse = {
        success: false,
        message: "取得任務列表失敗",
        error: error instanceof Error ? error.message : "未知錯誤",
      };
      return res.status(500).json(response);
    }
  }

  static async createTask(req: Request, res: Response) {
    try {
      const validate = z.object({
        title: z.string().min(1, "標題不能為空"),
        description: z.string().optional().nullable(),
        priority: z
          .string()
          .transform((val) => parseInt(val))
          .refine((val) => !isNaN(val) && val >= 0 && val <= 2, {
            message: "優先級必須為 0、1 或 2",
          }),
        userId: z
          .string()
          .transform((val) => parseInt(val))
          .refine((val) => !isNaN(val) && val > 0, {
            message: "userId 必須為正整數",
          }),
        dueDate: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/, "截止日期格式不正確，必須為 YYYY-MM-DD")
          .or(z.literal("")) // 允許空字符串
          .optional()
          .nullable(),
        status: z
          .string()
          .transform((val) => parseInt(val))
          .refine((val) => !isNaN(val) && val >= 0 && val <= 2, {
            message: "狀態必須為 0、1 或 2",
          }),
      });

      const result = validate.safeParse(req.query);
      if (!result.success) {
        const response: TaskResponse = {
          success: false,
          message: "無效的請求參數",
          error: result.error.issues.map((err) => err.message).join(", "),
        };
        return res.status(400).json(response);
      }

      await TaskController.taskService.createTask(result.data);
      
      const response: TaskResponse = {
        success: true,
        message: "任務創建成功",
      };
      return res.status(201).json(response);
    } catch (error) {
      let errorMessage = "userID 不存在";
      let statusCode = 500;
      
      if (error instanceof Error) {
        if (error.message.includes("userId")) {
          errorMessage = "userId 不存在或無效";
          statusCode = 400;
        } else {
          errorMessage = error.message;
        }
      }

      const response: TaskResponse = {
        success: false,
        message: "任務創建失敗",
        error: errorMessage,
      };
      return res.status(statusCode).json(response);
    }
  }

  static async updateTask(req: Request, res: Response) {
    try {
      const validate = z.object({
        id: z
          .string()
          .transform((val) => parseInt(val))
          .refine((val) => !isNaN(val) && val > 0, {
            message: "任務 ID 必須為正整數",
          }),
        title: z.string().min(1, "標題不能為空").optional(),
        description: z.string().optional().nullable(),
        priority: z
          .string()
          .transform((val) => parseInt(val))
          .refine((val) => !isNaN(val) && val >= 0 && val <= 2, {
            message: "優先級必須為 0、1 或 2",
          })
          .optional(),
        userId: z
          .string()
          .transform((val) => parseInt(val))
          .refine((val) => !isNaN(val) && val > 0, {
            message: "userId 必須為正整數",
          })
          .optional(),
        dueDate: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/, "截止日期格式不正確，必須為 YYYY-MM-DD")
          .or(z.literal("")) // 允許空字符串
          .optional()
          .nullable(),
        status: z
          .string()
          .transform((val) => parseInt(val))
          .refine((val) => !isNaN(val) && val >= 0 && val <= 2, {
            message: "狀態必須為 0、1 或 2",
          })
          .optional(),
      });

      const result = validate.safeParse(req.query);
      if (!result.success) {
        const response: TaskResponse = {
          success: false,
          message: "無效的請求參數",
          error: result.error.issues.map((err) => err.message).join(", "),
        };
        return res.status(400).json(response);
      }

      await TaskController.taskService.updateTask(result.data.id, {
        title: result.data.title,
        description: result.data.description,
        priority: result.data.priority,
        userId: result.data.userId,
        dueDate: result.data.dueDate || null,
        status: result.data.status,
      });

      const response: TaskResponse = {
        success: true,
        message: "任務更新成功",
      };
      return res.status(200).json(response);
    } catch (error) {
      const response: TaskResponse = {
        success: false,
        message: "更新任務失敗",
        error: error instanceof Error ? error.message : "未知錯誤",
      };
      return res.status(500).json(response);
    }
  }

  static async deleteTask(req: Request, res: Response) {
    try {
      const validate = z.object({
        id: z
          .string()
          .transform((val) => parseInt(val))
          .refine((val) => !isNaN(val) && val > 0, {
            message: "任務 ID 必須為正整數",
          }),
      });

      const result = validate.safeParse(req.query);
      console.log("Validation result:", result);
      if (!result.success) {
        const response: TaskResponse = {
          success: false,
          message: "無效的請求參數",
          error: result.error.issues.map((err) => err.message).join(", "),
        };
        return res.status(400).json(response);
      }

      await TaskController.taskService.deleteTask(result.data.id);

      const response: TaskResponse = {
        success: true,
        message: "任務刪除成功",
      };
      return res.status(200).json(response);
    } catch (error) {
      const response: TaskResponse = {
        success: false,
        message: "刪除任務失敗",
        error: error instanceof Error ? error.message : "未知錯誤",
      };
      return res.status(500).json(response);
    }
  }
}
