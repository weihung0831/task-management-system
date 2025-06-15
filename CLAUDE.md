# CLAUDE.md

這個檔案為 Claude Code (claude.ai/code) 在此儲存庫中工作時提供指導。

## 專案概述
- React + TypeScript + Vite 看板任務管理應用程式
- 使用 DND Kit 實現拖拉排序的任務管理系統
- 採用 CSS Modules 搭配設計系統變數進行元件樣式管理

## 技術堆疊
- React 19.1.0
- TypeScript 5.8.3
- Vite 6.3.5
- Material-UI 7.1.1
- DND Kit 6.3.1 拖拉排序功能
- Redux Toolkit 2.8.2
- React Router 7.6.2
- Socket.io Client 4.8.1

## 開發指令
```bash
npm run dev      # 啟動開發伺服器
npm run build    # 產品構建
npm run lint     # 執行 ESLint
npm run preview  # 預覽產品構建
```

## 架構說明

### 狀態管理
- 主要應用程式狀態在 `App.tsx` 中管理，負責三個欄位的任務：`todo`、`in-progress`、`completed`
- 任務資料結構：`{ id, title, priority, assignee }`
- 拖拉排序透過 DND Kit 的 `DndContext` 搭配 `handleDragStart` 和 `handleDragEnd` 處理

### 樣式系統
- 採用 CSS Modules 模式進行元件特定樣式 (`.module.css`)
- 全域設計系統變數位於 `src/styles/variables.css`
- 使用 CSS 自訂屬性定義顏色、間距、字型、陰影
- 全域佈局和重置樣式位於 `src/styles/globals.css`

### 元件結構
- `App.tsx`：主要佈局搭配 DndContext，管理任務狀態和拖拉操作
- `KanbanColumn.tsx`：使用 `useDroppable` 的可放置欄位容器
- `TaskCard.tsx`：使用 `useDraggable` 的可拖拉任務項目
- `Toolbar.tsx`：頂部導航/操作列
- `Sidebar.tsx`：左側導航面板
- `AddTaskModal.tsx`：新增任務的模態視窗，包含表單輸入

### 佈局架構
- 基於 Flexbox 的佈局：側邊欄 (240px) + 主內容區域
- 主內容：工具列 (64px 高度) + 看板區域
- 使用 CSS 自訂屬性實現響應式設計

### 檔案組織
- `/src/components/` - React 元件
- `/src/styles/` - CSS 模組和全域樣式
- 元件樣式命名為 `元件名稱.module.css`
- 全域樣式：`variables.css`、`globals.css`

## 目前功能
- 三欄位看板 (待辦事項、進行中、已完成)
- 任務在欄位間的拖拉移動
- 任務優先級系統 (高優先、中優先、低優先)
- 任務指派給團隊成員
- 新增任務模態視窗與表單驗證

## 開發注意事項
- 使用中文進行 UI 文字和註解
- ESLint 配置包含 React hooks 和 TypeScript 規則
- 使用 Vite 進行快速開發和構建
- CSS 自訂屬性實現一致的主題設計
- 模態元件支援點擊遮罩和 ESC 鍵關閉功能