import React from "react";
import taskCardStyles from "../styles/TaskCard.module.css";
import { useDraggable } from "@dnd-kit/core";
import type { Task } from "../App";

interface TaskCardProps {
  task: Task;
  columnId?: string;
  onTaskClick?: (taskId: string) => void;
}

const TaskCard = React.memo(function TaskCard({ task, columnId, onTaskClick }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    data: { columnId }
  });

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "high":
        return taskCardStyles.priorityHigh;
      case "medium":
        return taskCardStyles.priorityMedium;
      case "low":
        return taskCardStyles.priorityLow;
      default:
        return taskCardStyles.priorityMedium;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "🔴 高優先";
      case "medium":
        return "🟡 中優先";
      case "low":
        return "🟢 低優先";
      default:
        return "🟡 中優先";
    }
  };

  const handleDetailClick = (e: React.MouseEvent) => {
    // 阻止事件冒泡，避免觸發拖拽
    e.stopPropagation();
    onTaskClick?.(task.id);
  };

  const style = {
    opacity: isDragging ? 0.5 : 1,
    transform: isDragging ? 'scale(0.95)' : 'scale(1)',
    transition: 'all 0.2s ease',
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      className={taskCardStyles.taskCard}
      style={style}
      onClick={handleDetailClick}
      {...attributes}
    >
      <div className={taskCardStyles.taskHeader}>
        <div 
          className={taskCardStyles.dragHandle}
          {...listeners}
          title="拖動排序"
        >
          ⋮⋮
        </div>
        <div className={taskCardStyles.taskTitle}>{task.title}</div>
      </div>
      <div className={taskCardStyles.taskMeta}>
        <span
          className={`${taskCardStyles.taskPriority} ${getPriorityClass(
            task.priority
          )}`}
        >
          {getPriorityText(task.priority)}
        </span>
        <div className={taskCardStyles.taskAssignee}>{task.assignee}</div>
      </div>
    </div>
  );
});

TaskCard.displayName = 'TaskCard';

export default TaskCard;
