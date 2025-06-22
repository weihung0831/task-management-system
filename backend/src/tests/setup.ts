// Jest 測試設定檔案

// 設定測試環境變數
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'file:./test.db';

// 模擬 console 方法（可選）
global.console = {
  ...console,
  // 在測試中隱藏某些 log
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: console.warn,
  error: console.error,
};

// 設定測試超時時間
jest.setTimeout(10000);

// 全域測試清理
afterEach(() => {
  jest.clearAllMocks();
});