import taskCardStyles from "../styles/TaskCard.module.css";

interface TaskCardProps {
  title: string;
  priority: "高優先" | "中優先" | "低優先";
  assignee: string;
}

export default function TaskCard({ title, priority, assignee }: TaskCardProps) {
  const getPriorityClass = () => {
    switch (priority) {
      case "高優先": return taskCardStyles.priorityHigh;
      case "中優先": return taskCardStyles.priorityMedium;
      case "低優先": return taskCardStyles.priorityLow;
      default: return taskCardStyles.priorityMedium;
    }
  };

  return (
    <div className={taskCardStyles.taskCard}>
      <div className={taskCardStyles.taskTitle}>{title}</div>
      <div className={taskCardStyles.taskMeta}>
        <span className={`${taskCardStyles.taskPriority} ${getPriorityClass()}`}>
          {priority}
        </span>
        <div className={taskCardStyles.taskAssignee}>{assignee}</div>
      </div>
    </div>
  );
}
