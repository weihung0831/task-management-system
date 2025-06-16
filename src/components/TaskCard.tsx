import taskCardStyles from "../styles/TaskCard.module.css";
import { useDraggable } from "@dnd-kit/core";
import type { Task } from "../types";

interface TaskCardProps {
  task: Task;
}

// 優先級常數
const PRIORITY = {
  HIGH: "高優先",
  MEDIUM: "中優先", 
  LOW: "低優先"
} as const;

// 優先級樣式映射
const PRIORITY_CLASS_MAP = {
  [PRIORITY.HIGH]: taskCardStyles.priorityHigh,
  [PRIORITY.MEDIUM]: taskCardStyles.priorityMedium,
  [PRIORITY.LOW]: taskCardStyles.priorityLow,
} as const;

export default function TaskCard({ task }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } =
    useDraggable({
      id: task.id,
    });

  const getPriorityClass = (priority: string) => {
    return PRIORITY_CLASS_MAP[priority as keyof typeof PRIORITY_CLASS_MAP] || taskCardStyles.priorityMedium;
  };

  const style = {
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      className={taskCardStyles.taskCard}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className={taskCardStyles.taskTitle}>{task.title}</div>
      <div className={taskCardStyles.taskMeta}>
        <span
          className={`${taskCardStyles.taskPriority} ${getPriorityClass(
            task.priority
          )}`}
        >
          {task.priority}
        </span>
        <div className={taskCardStyles.taskAssignee}>{task.assignee}</div>
      </div>
    </div>
  );
}
