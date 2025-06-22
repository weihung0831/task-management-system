import request from 'supertest';
import app from '../app';
import { TaskService } from '../services/TaskService';

// Mock TaskService
jest.mock('../services/TaskService');
const mockTaskService = TaskService as jest.MockedClass<typeof TaskService>;

describe('Task API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /tasks', () => {
    it('應該取得所有任務列表', async () => {
      const mockTasks = [
        {
          id: 1,
          title: '測試任務',
          description: '測試描述',
          priority: 1,
          userId: 1,
          dueDate: null,
          status: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockTaskService.prototype.getTasks.mockResolvedValue(mockTasks);

      const response = await request(app)
        .get('/tasks')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: '取得所有任務列表成功',
        data: expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            title: '測試任務',
            description: '測試描述',
            priority: 1,
            userId: 1,
            status: 0,
          })
        ]),
      });
    });

    it('應該根據 userId 取得任務列表', async () => {
      const mockTasks = [
        {
          id: 1,
          title: '用戶任務',
          description: '用戶描述',
          priority: 1,
          userId: 123,
          dueDate: null,
          status: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockTaskService.prototype.getTasks.mockResolvedValue(mockTasks);

      const response = await request(app)
        .get('/tasks?userId=123')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: '取得任務列表成功',
        data: expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            title: '用戶任務',
            description: '用戶描述',
            priority: 1,
            userId: 123,
            status: 0,
          })
        ]),
      });
    });

    it('應該回傳 400 當 userId 無效時', async () => {
      const response = await request(app)
        .get('/tasks?userId=invalid')
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        message: '無效的請求參數',
        error: expect.stringContaining('userId'),
      });
    });

    it('應該回傳 500 當服務出錯時', async () => {
      mockTaskService.prototype.getTasks.mockRejectedValue(
        new Error('資料庫連線失敗')
      );

      const response = await request(app)
        .get('/tasks')
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        message: '取得任務列表失敗',
        error: '資料庫連線失敗',
      });
    });
  });

  describe('POST /tasks', () => {
    const validTaskData = {
      title: '新任務',
      description: '任務描述',
      priority: '1',
      userId: '1',
      dueDate: '2025-12-31',
      status: '0',
    };

    it('應該成功創建任務', async () => {
      mockTaskService.prototype.createTask.mockResolvedValue({
        id: 1,
        title: validTaskData.title,
        description: validTaskData.description,
        priority: 1,
        userId: 1,
        dueDate: new Date('2025-12-31'),
        status: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .post('/tasks')
        .query(validTaskData)
        .expect(201);

      expect(response.body).toEqual({
        success: true,
        message: '任務創建成功',
      });
    });

    it('應該回傳 400 當標題為空時', async () => {
      const invalidData = { ...validTaskData, title: '' };

      const response = await request(app)
        .post('/tasks')
        .query(invalidData)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        message: '無效的請求參數',
        error: expect.stringContaining('標題不能為空'),
      });
    });

    it('應該回傳 400 當優先級無效時', async () => {
      const invalidData = { ...validTaskData, priority: '5' };

      const response = await request(app)
        .post('/tasks')
        .query(invalidData)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        message: '無效的請求參數',
        error: expect.stringContaining('優先級必須為 0、1 或 2'),
      });
    });

    it('應該回傳 400 當用戶不存在時', async () => {
      mockTaskService.prototype.createTask.mockRejectedValue(
        new Error('userId 不存在')
      );

      const response = await request(app)
        .post('/tasks')
        .query(validTaskData)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        message: '任務創建失敗',
        error: 'userId 不存在或無效',
      });
    });
  });

  describe('PUT /tasks', () => {
    const updateData = {
      id: '1',
      title: '更新的任務',
      description: '更新的描述',
      priority: '2',
      status: '1',
    };

    it('應該成功更新任務', async () => {
      mockTaskService.prototype.updateTask.mockResolvedValue({
        id: 1,
        title: '更新的任務',
        description: '更新的描述',
        priority: 2,
        userId: 1,
        dueDate: null,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .put('/tasks')
        .query(updateData)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: '任務更新成功',
      });
    });

    it('應該回傳 400 當任務 ID 無效時', async () => {
      const invalidData = { ...updateData, id: 'invalid' };

      const response = await request(app)
        .put('/tasks')
        .query(invalidData)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        message: '無效的請求參數',
        error: expect.stringContaining('任務 ID 必須為正整數'),
      });
    });

    it('應該回傳 500 當任務不存在時', async () => {
      mockTaskService.prototype.updateTask.mockRejectedValue(
        new Error('任務 ID 999 不存在')
      );

      const response = await request(app)
        .put('/tasks')
        .query({ ...updateData, id: '999' })
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        message: '更新任務失敗',
        error: '任務 ID 999 不存在',
      });
    });
  });

  describe('DELETE /tasks', () => {
    it('應該成功刪除任務', async () => {
      mockTaskService.prototype.deleteTask.mockResolvedValue(undefined);

      const response = await request(app)
        .delete('/tasks?id=1')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: '任務刪除成功',
      });
    });

    it('應該回傳 400 當任務 ID 無效時', async () => {
      const response = await request(app)
        .delete('/tasks?id=invalid')
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        message: '無效的請求參數',
        error: expect.stringContaining('任務 ID 必須為正整數'),
      });
    });

    it('應該回傳 500 當任務不存在時', async () => {
      mockTaskService.prototype.deleteTask.mockRejectedValue(
        new Error('任務 ID 999 不存在')
      );

      const response = await request(app)
        .delete('/tasks?id=999')
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        message: '刪除任務失敗',
        error: '任務 ID 999 不存在',
      });
    });

    it('應該回傳 400 當缺少 ID 參數時', async () => {
      const response = await request(app)
        .delete('/tasks')
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        message: '無效的請求參數',
        error: expect.any(String),
      });
    });
  });
});