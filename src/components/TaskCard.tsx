import taskCardStyles from "../styles/TaskCard.module.css";
import { useDraggable } from "@dnd-kit/core";

interface Task {
  id: string;
  title: string;
  priority: string;
  assignee: string;
}

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } =
    useDraggable({
      id: task.id,
    });

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "高優先":
        return taskCardStyles.priorityHigh;
      case "中優先":
        return taskCardStyles.priorityMedium;
      case "低優先":
        return taskCardStyles.priorityLow;
      default:
        return taskCardStyles.priorityMedium;
    }
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
