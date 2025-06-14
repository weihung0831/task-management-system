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
import { useState } from "react";
import TaskCard from "./components/TaskCard";

type Task = {
  id: string;
  title: string;
  priority: "高優先" | "中優先" | "低優先";
  assignee: string;
};

type TasksState = {
  [key: string]: Task[];
  todo: Task[];
  "in-progress": Task[];
  completed: Task[];
};

export default function App() {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

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

  // 取得所有tasks
  const allTasks = [...tasks.todo, ...tasks["in-progress"], ...tasks.completed];

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = allTasks.find((t) => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) {
      return;
    }

    const taskId = active.id as string;
    const newColumnId = over.id as string;

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
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="app-layout">
        <div className={sidebarStyles.sidebar}>
          <Sidebar />
        </div>
        <div className="main-content">
          <div className={toolbarStyles.toolbar}>
            <Toolbar />
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
