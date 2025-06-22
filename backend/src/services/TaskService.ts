import prisma from "../lib/prisma";

export interface TaskQuery {
  userId?: number;
}

export interface TaskData {
  title: string;
  description?: string | null;
  priority: number;
  userId: number;
  dueDate?: string | null;
  status: number;
}

export class TaskService {
  async getTasks(query: TaskQuery) {
    try {
      const { userId } = query;

      if (userId) {
        const tasks = await prisma.task.findMany({
          where: { userId },
        });

        return tasks;
      } else {
        // 如果沒有提供 userId，則返回所有任務
        const tasks = await prisma.task.findMany();
        return tasks;
      }
    } catch (error) {
      throw error;
    }
  }

  async createTask(data: TaskData) {
    try {
      const { title, description, priority, userId, dueDate, status } = data;
      const result = await prisma.task.create({
        data: {
          title,
          description,
          priority,
          userId,
          dueDate: dueDate ? new Date(dueDate + "T00:00:00.000Z") : null,
          status,
        },
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateTask(id: number, data: Partial<TaskData>) {
    try {
      const { title, description, priority, userId, dueDate, status } = data;

      // 檢查 id 是否存在於資料庫中
      const existingTask = await prisma.task.findUnique({
        where: { id },
      });
      if (existingTask === null) {
        throw new Error(`任務 ID ${id} 不存在`);
      }

      const result = await prisma.task.update({
        where: { id },
        data: {
          title,
          description,
          priority,
          userId,
          dueDate: dueDate ? new Date(dueDate + "T00:00:00.000Z") : null,
          status,
        },
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteTask(id: number) {
    try {
      // 檢查 id 是否存在於資料庫中
      const existingTask = await prisma.task.findUnique({
        where: { id },
      });
      if (existingTask === null) {
        throw new Error(`任務 ID ${id} 不存在`);
      }

      await prisma.task.delete({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }
}
