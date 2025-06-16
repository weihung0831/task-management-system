import "./styles/variables.css";
import "./styles/globals.css";
import sidebarStyles from "./styles/Sidebar.module.css";
import toolbarStyles from "./styles/Toolbar.module.css";
import kanbanBoardStyles from "./styles/KanbanBoard.module.css";
import KanbanColumn from "./components/KanbanColumn";
import Toolbar from "./components/Toolbar";
import Sidebar from "./components/Sidebar";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useMemo, useState } from "react";
import TaskCard from "./components/TaskCard";
import type { Task } from "./types";

type TasksState = {
  [key: string]: Task[];
  todo: Task[];
  "in-progress": Task[];
  completed: Task[];
};

export default function App() {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeNavItem, setActiveNavItem] = useState("kanban");

  // 狀態管理：將tasks按列分組
  const [tasks, setTasks] = useState<TasksState>({
    todo: [
      { id: "1", title: "設計用戶登入介面", priority: "高優先", assignee: "A" },
      { id: "2", title: "建立資料庫Schema", priority: "中優先", assignee: "B" },
      { id: "3", title: "撰寫API文檔", priority: "低優先", assignee: "C" },
    ],
    "in-progress": [
      { id: "4", title: "開發用戶認證功能", priority: "高優先", assignee: "D" },
      { id: "5", title: "實作拖拉排序", priority: "中優先", assignee: "E" },
    ],
    completed: [
      { id: "6", title: "專案初始設定", priority: "低優先", assignee: "F" },
    ],
  });

  // 將所有任務合併到一個陣列中，方便拖放操作
  const allTasks = useMemo(() => {
    return [...tasks.todo, ...tasks["in-progress"], ...tasks.completed];
  }, [tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = allTasks.find((t) => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const taskId = String(active.id);
    const newColumnId = String(over.id);

    // 找到task原本在哪一列
    let sourceColumn = "";
    for (const [columnId, columnTasks] of Object.entries(tasks)) {
      if (columnTasks.find((task) => task.id === taskId)) {
        sourceColumn = columnId;
        break;
      }
    }

    // 如果移動到同一列，不做任何事
    if (sourceColumn === newColumnId) {
      setActiveTask(null);
      return;
    }

    // 移動task到新列
    setTasks((prev) => {
      const task = prev[sourceColumn].find((t) => t.id === taskId);

      if (!task) return prev;

      return {
        ...prev,
        [sourceColumn]: prev[sourceColumn].filter((t) => t.id !== taskId),
        [newColumnId]: [...prev[newColumnId], task],
      };
    });

    // 重置拖拉狀態（放在最後）
    setActiveTask(null);
  };

  // 處理導航項目點擊
  const handleNavItemClick = (itemId: string) => {
    setActiveNavItem(itemId);
    console.log(`導航到: ${itemId}`);
  };

  // 處理工具列動作
  const handleAddTask = () => {
    console.log("新增任務");
    // TODO: 開啟新增任務modal
  };

  const handleUserClick = () => {
    console.log("用戶選單");
    // TODO: 開啟用戶選單
  };

  // 工具列動作配置
  const toolbarActions = useMemo(() => [
    {
      id: "add-task",
      label: "新增任務", 
      variant: "primary" as const,
      icon: "+",
      onClick: handleAddTask
    }
  ], []);

  const currentUser = useMemo(() => ({
    name: "開發者",
    initials: "開"
  }), []);

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="app-layout">
        <div className={sidebarStyles.sidebar}>
          <Sidebar 
            activeItemId={activeNavItem}
            onItemClick={handleNavItemClick}
          />
        </div>
        <div className="main-content">
          <div className={toolbarStyles.toolbar}>
            <Toolbar 
              title="專案看板"
              actions={toolbarActions}
              user={currentUser}
              onUserClick={handleUserClick}
            />
          </div>
          <div className={kanbanBoardStyles.kanbanBoard}>
            <KanbanColumn id="todo" title="待辦事項" tasks={tasks.todo} />
            <KanbanColumn
              id="in-progress"
              title="進行中"
              tasks={tasks["in-progress"]}
            />
            <KanbanColumn
              id="completed"
              title="已完成"
              tasks={tasks.completed}
            />
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
