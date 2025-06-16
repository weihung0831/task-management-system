# CLAUDE.md

## 專案概述
- React + TypeScript + Vite 看板任務管理應用程式
- 使用 DND Kit 實現拖拉排序的任務管理系統
- 採用 CSS Modules 搭配設計系統變數進行元件樣式管理

## Code Review 行為指導

### 自動 Code Review
- 對每個 Pull Request 自動執行程式碼審查
- **必須使用 inline comments 在 Files changed 頁面的特定程式碼行留言**
- **不要在 Conversation 中留下整體評論**
- 每個具體問題都要直接標註在相關的程式碼行
- 使用 GitHub PR review comments 格式進行逐行審查

### 審查重點
- TypeScript 型別安全性
- React 最佳實踐和 hooks 使用
- 效能優化機會
- 程式碼可讀性和維護性
- 潛在的 bug 和邏輯問題

### Review 格式要求
- 使用 GitHub 的 Pull Request review 功能
- 針對每個具體問題在對應程式碼行留下 inline comment
- 不要在 Conversation tab 中留下整體性的評論
- 每個 comment 都要指向特定的程式碼位置

## Commit 訊息規範
- 使用 Conventional Commits 格式
- 前綴規則：
  - `feat:` 新功能
  - `fix:` 錯誤修復
  - `docs:` 文檔更新
  - `style:` 程式碼格式化
  - `refactor:` 重構代碼
  - `test:` 測試相關
  - `chore:` 建置流程或輔助工具變更

## Pull Request 規範
- 所有 PR 必須包含：
  - 清楚的描述和變更說明
  - 相關的 issue 連結（如適用）
  - 通過所有 CI 檢查
  - 至少一個程式碼審查通過

## AI 協作指導
- 優先考慮最小化、專注的變更
- 維持現有程式碼結構和設計模式
- 新功能需包含適當的錯誤處理
- 確保向後兼容性
- 程式碼變更需要清楚的解釋和理由