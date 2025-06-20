import prisma from "../lib/prisma";
import { Request, Response } from "express";

interface TaskQuery {
  userId?: number;
}

export class TaskController {
  // Get tasks
  static async getTasks(req: Request, res: Response) {
    try {
      const { userId }: TaskQuery = req.query;
      let tasks;
      if (userId) {
        const userIdNumber = Number(userId);
        if (isNaN(userIdNumber) || userIdNumber <= 0) {
          res.status(400).json({
            success: false,
            message: "無效的 userId",
          });
        } else {
          tasks = await prisma.task.findMany({
            where: { userId: userIdNumber },
          });

          res.json({
            success: true,
            message: "取得任務列表成功",
            data: tasks,
          });
        }
      } else {
        // 如果沒有提供 userId，則返回所有任務
        tasks = await prisma.task.findMany();

        res.json({
          success: true,
          message: "取得所有任務列表成功",
          data: tasks,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "取得任務列表失敗",
        error: error instanceof Error ? error.message : "未知錯誤",
      });
    }
  }
}
