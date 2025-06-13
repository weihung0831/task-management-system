import "./styles/variables.css";
import "./styles/globals.css";
import sidebarStyles from "./styles/Sidebar.module.css";
import toolbarStyles from "./styles/Toolbar.module.css";
import kanbanBoardStyles from "./styles/KanbanBoard.module.css";
import KanbanColumn from "./components/KanbanColumn";
import Toolbar from "./components/Toolbar";
import Sidebar from "./components/Sidebar";

export default function App() {
  return (
    <div className="app-layout">
      <div className={sidebarStyles.sidebar}>
        <Sidebar />
      </div>
      <div className="main-content">
        <div className={toolbarStyles.toolbar}>
          <Toolbar />
        </div>
        <div className={kanbanBoardStyles.kanbanBoard}>
          <KanbanColumn
            title="待辦事項"
            tasks={[
              {
                id: "1",
                title: "設計用戶登入介面",
                priority: "高優先",
                assignee: "A",
              },
              {
                id: "2",
                title: "建立資料庫Schema",
                priority: "中優先",
                assignee: "B",
              },
              {
                id: "3",
                title: "撰寫API文檔",
                priority: "低優先",
                assignee: "C",
              },
            ]}
          />
          <KanbanColumn
            title="進行中"
            tasks={[
              {
                id: "4",
                title: "開發用戶認證功能",
                priority: "高優先",
                assignee: "D",
              },
              {
                id: "5",
                title: "實作拖拉排序",
                priority: "中優先",
                assignee: "E",
              },
            ]}
          />
          <KanbanColumn
            title="已完成"
            tasks={[
              {
                id: "6",
                title: "專案初始設定",
                priority: "低優先",
                assignee: "F",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
