import { Request, Response } from "express";

export class TestController {
  static async healthCheck(req: Request, res: Response) {
    try {
      res.json({
        success: true,
        message: "API 正在運行中",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "內部伺服器錯誤",
        error: error instanceof Error ? error.message : "未知錯誤",
      });
    }
  }
}
