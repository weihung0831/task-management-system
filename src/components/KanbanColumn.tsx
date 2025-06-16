import kanbanColumnStyles from "../styles/KanbanColumn.module.css";
import TaskCard from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";
import type { Task } from "../App";

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
}

export default function KanbanColumn({ id, title, tasks }: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`${kanbanColumnStyles.kanbanColumn} ${
        isOver ? kanbanColumnStyles.dragOver : ""
      }`}
    >
      <div className={kanbanColumnStyles.columnHeader}>
        <div className={kanbanColumnStyles.columnTitle}>{title}</div>
        <div className={kanbanColumnStyles.taskCount}>
          {tasks.length} 個任務
        </div>
      </div>

      <div className={kanbanColumnStyles.taskList}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} columnId={id} />
        ))}
      </div>
    </div>
  );
}
