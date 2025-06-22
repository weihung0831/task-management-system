import app from './app';
import { connectDatabase } from './config/database';

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // 連接資料庫
    await connectDatabase();
    
    // 啟動伺服器
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();