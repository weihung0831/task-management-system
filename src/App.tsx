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
export type Task = {
  id: string;
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  assignee: string;
  dueDate?: string;
  status: "todo" | "in-progress" | "completed";
};

type TasksState = {
  [key: string]: Task[];
  todo: Task[];
  "in-progress": Task[];
  completed: Task[];
};

export default function App() {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeNavItem, setActiveNavItem] = useState("kanban");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 狀態管理：將tasks按列分組
  const [tasks, setTasks] = useState<TasksState>({
    todo: [
      {
        id: "1",
        title: "設計用戶登入介面",
        priority: "high",
        assignee: "A",
        status: "todo",
      },
      {
        id: "2",
        title: "建立資料庫Schema",
        priority: "medium",
        assignee: "B",
        status: "todo",
      },
      {
        id: "3",
        title: "撰寫API文檔",
        priority: "low",
        assignee: "C",
        status: "todo",
      },
    ],
    "in-progress": [
      {
        id: "4",
        title: "開發用戶認證功能",
        priority: "high",
        assignee: "D",
        status: "in-progress",
      },
      {
        id: "5",
        title: "實作拖拉排序",
        priority: "medium",
        assignee: "E",
        status: "in-progress",
      },
    ],
    completed: [
      {
        id: "6",
        title: "專案初始設定",
        priority: "low",
        assignee: "F",
        status: "completed",
      },
    ],
  });

  // 將所有任務合併到一個陣列中，方便拖放操作
  const allTasks = useMemo(() => {
    return [...tasks.todo, ...tasks["in-progress"], ...tasks.completed];
  }, [tasks]);

  // 新增任務函數
  const addTask = (newTask: Omit<Task, "id">) => {
    const taskWithId = {
      ...newTask,
      id: crypto.randomUUID(), // 使用 crypto.randomUUID() 生成唯一ID
    };

    setTasks((prev) => ({
      ...prev,
      [newTask.status]: [...prev[newTask.status], taskWithId],
    }));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = allTasks.find((t) => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const taskId = String(active.id);
    const newColumnId = String(over.id);

    // 從 draggable data 中取得來源欄位
    const sourceColumn = active.data.current?.columnId as string;

    // 如果移動到同一列，不做任何事
    if (sourceColumn === newColumnId) {
      setActiveTask(null);
      return;
    }

    // 設置載入狀態
    setIsLoading(true);
    setError(null);

    try {
      // 模擬 API 呼叫延遲
      await new Promise(resolve => setTimeout(resolve, 300));

      // 移動task到新列
      setTasks((prev) => {
        // 檢查來源欄位是否存在
        if (!sourceColumn || !prev[sourceColumn]) {
          throw new Error(`來源欄位不存在: ${sourceColumn}`);
        }

        // 檢查目標欄位是否存在
        if (!newColumnId || !prev[newColumnId]) {
          throw new Error(`目標欄位不存在: ${newColumnId}`);
        }

        // 檢查任務是否存在
        const task = prev[sourceColumn].find((t) => t.id === taskId);
        if (!task) {
          throw new Error(`任務不存在: ${taskId} 在欄位 ${sourceColumn}`);
        }

        return {
          ...prev,
          [sourceColumn]: prev[sourceColumn].filter((t) => t.id !== taskId),
          [newColumnId]: [...prev[newColumnId], task],
        };
      });

      // 未來這裡可以加入 API 呼叫
      // await updateTaskStatus(taskId, newColumnId);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '移動任務時發生錯誤';
      setError(errorMessage);
      console.error('拖拉排序錯誤:', err);
    } finally {
      setIsLoading(false);
      setActiveTask(null);
    }
  };

  // 處理導航項目點擊
  const handleNavItemClick = (itemId: string) => {
    setActiveNavItem(itemId);
    console.log(`導航到: ${itemId}`);
  };

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
            <Toolbar onAddTask={addTask} />
          </div>
          
          {/* 錯誤訊息 */}
          {error && (
            <div style={{
              padding: '12px',
              margin: '16px',
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              borderRadius: '8px',
              color: '#c33',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>{error}</span>
              <button 
                onClick={() => setError(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#c33',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                ×
              </button>
            </div>
          )}

          <div className={kanbanBoardStyles.kanbanBoard} style={{
            opacity: isLoading ? 0.7 : 1,
            pointerEvents: isLoading ? 'none' : 'auto',
            transition: 'opacity 0.3s ease'
          }}>
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

          {/* 載入指示器 */}
          {isLoading && (
            <div style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '16px 24px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              zIndex: 1000
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid #fff',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              正在移動任務...
            </div>
          )}
        </div>
      </div>

      <DragOverlay 
        adjustScale={false}
        dropAnimation={{
          duration: 300,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}
      >
        {activeTask ? (
          <div 
            style={{
              transform: 'rotate(3deg) scale(1.05)',
              boxShadow: '0 15px 30px rgba(0, 0, 0, 0.25)',
              cursor: 'grabbing',
              transition: 'transform 0.2s ease',
            }}
          >
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
