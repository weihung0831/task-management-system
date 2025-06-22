import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("開始生成測試資料...");

  // 清除現有資料
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  // 建立使用者
  const users = await prisma.user.createMany({
    data: [
      {
        name: "張小明",
        email: "ming@example.com",
        password: "password123",
      },
      {
        name: "李小美",
        email: "mei@example.com",
        password: "password123",
      },
      {
        name: "王大華",
        email: "wang@example.com",
        password: "password123",
      },
      {
        name: "陳小玲",
        email: "chen@example.com",
        password: "password123",
      },
      {
        name: "林志強",
        email: "lin@example.com",
        password: "password123",
      },
    ],
  });

  // 取得所有使用者 ID
  const allUsers = await prisma.user.findMany();

  // 建立大量任務
  const tasks: {
    title: string;
    description: string;
    priority: number;
    status: number;
    userId: number;
    dueDate: Date | null;
  }[] = [];

  const taskTitles = [
    "完成專案文件撰寫",
    "修復登入系統bug",
    "設計新功能UI介面",
    "進行程式碼重構",
    "撰寫單元測試",
    "更新API文件",
    "優化資料庫查詢",
    "實作用戶權限管理",
    "建立CI/CD流程",
    "進行安全性檢查",
    "優化前端效能",
    "整合第三方API",
    "建立監控系統",
    "修復響應式設計問題",
    "實作搜尋功能",
    "建立備份機制",
    "優化SEO設定",
    "進行用戶體驗測試",
    "建立錯誤處理機制",
    "實作即時通知功能",
    "優化圖片載入速度",
    "建立多語言支援",
    "實作檔案上傳功能",
    "進行效能壓測",
    "建立分析報表功能",
  ];

  const descriptions = [
    "需要詳細規劃和仔細執行的重要任務",
    "影響用戶體驗的關鍵功能改進",
    "提升系統穩定性和可靠性",
    "優化使用者介面和操作流程",
    "確保程式碼品質和可維護性",
    "增強系統安全性和資料保護",
    "改善系統效能和回應速度",
    "擴展功能以滿足業務需求",
    "建立自動化流程提升效率",
    "監控系統運行狀態和健康度",
  ];

  // 為每個使用者建立隨機任務
  for (let i = 0; i < 50; i++) {
    const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
    const randomTitle =
      taskTitles[Math.floor(Math.random() * taskTitles.length)];
    const randomDescription =
      descriptions[Math.floor(Math.random() * descriptions.length)];
    const randomPriority = Math.floor(Math.random() * 3); // 0: low, 1: medium, 2: high
    const randomStatus = Math.floor(Math.random() * 3); // 0: pending, 1: in progress, 2: completed

    // 隨機決定是否有截止日期
    const hasDueDate = Math.random() > 0.3;
    const dueDate = hasDueDate
      ? new Date(
          Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
        ) // 未來30天內
      : null;

    tasks.push({
      title: `${randomTitle} #${i + 1}`,
      description: randomDescription,
      priority: randomPriority,
      status: randomStatus,
      userId: randomUser.id,
      dueDate: dueDate,
    });
  }

  // 批量建立任務
  await prisma.task.createMany({
    data: tasks,
  });

  console.log(`✅ 成功建立 ${users.count} 個使用者`);
  console.log(`✅ 成功建立 ${tasks.length} 個任務`);
  console.log("測試資料生成完成！");
}

main()
  .catch((e) => {
    console.error("錯誤:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("資料庫連線已關閉");
  });
