import toolbarStyles from "../styles/Toolbar.module.css";
import AddTaskModal from "./AddTaskModal";
import { useState, useCallback } from "react";
import type { Task } from "../App";

interface ToolbarProps {
  onAddTask: (task: Omit<Task, "id">) => void;
}

export default function Toolbar({ onAddTask }: ToolbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const AddTask = () => {
    setIsOpen(true);
  };

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <div className={toolbarStyles.title}>專案看板</div>
      <div className={toolbarStyles.actions}>
        <button className="btn-primary" onClick={AddTask}>
          + 新增任務
        </button>
        <AddTaskModal
          isOpen={isOpen}
          onClose={closeModal}
          onAddTask={onAddTask}
        />
        <div className={toolbarStyles.userAvatar}>U</div>
      </div>
    </>
  );
}
