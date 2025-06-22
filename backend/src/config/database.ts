import prisma from '../lib/prisma';

export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ 資料庫連接成功');
  } catch (error) {
    console.error('❌ 資料庫連接失敗:', error);
    throw error;
  }
}

export async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    console.log('🔌 資料庫連接已關閉');
  } catch (error) {
    console.error('❌ 資料庫斷開連接失敗:', error);
  }
}