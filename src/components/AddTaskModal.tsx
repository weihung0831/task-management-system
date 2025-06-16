import styles from "../styles/AddTaskModal.module.css";
import React, { useEffect, useState } from "react";
import type { Task } from "../App";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onAddTask?: (task: Omit<Task, "id">) => void;
}

export default function AddTaskModal({
  isOpen,
  onClose,
  onAddTask,
}: AddTaskModalProps) {
  const cancel = () => {
    onClose?.();
  };

  // ESC 鍵關閉
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  // 點擊背景關閉
  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<"todo" | "in-progress" | "completed">(
    "todo"
  );

  if (!isOpen) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    // 表單驗證
    if (!title.trim()) {
      alert("請輸入任務標題");
      return;
    }
    if (!assignee) {
      alert("請選擇指派人員");
      return;
    }

    // 創建任務對象
    const newTask = {
      title: title.trim(),
      description: description.trim(),
      priority,
      assignee,
      dueDate,
      status,
    };

    // 調用父組件的 addTask 函數
    onAddTask?.(newTask);

    // 重置表單
    setTitle("");
    setDescription("");
    setPriority("medium");
    setAssignee("");
    setDueDate("");
    setStatus("todo");

    // 關閉 modal 視窗
    onClose?.();
  };

  return (
    <div
      className={`${styles.modalOverlay} ${styles.show}`}
      onClick={handleOverlayClick}
    >
      <div className={styles.modalContainer}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>新增任務</h2>
          <button className={styles.closeButton} type="button" onClick={cancel}>
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className={styles.modalBody}>
          <form onSubmit={submit}>
            {/* 任務標題 */}
            <div className={styles.formGroup}>
              <label className={`${styles.formLabel} ${styles.required}`}>
                任務標題
              </label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="請輸入任務標題..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* 任務描述 */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>任務描述</label>
              <textarea
                className={`${styles.formInput} ${styles.formTextarea}`}
                placeholder="請輸入任務詳細描述..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* 優先級 */}
            <div className={styles.formGroup}>
              <label className={`${styles.formLabel} ${styles.required}`}>
                優先級
              </label>
              <div className={styles.priorityGroup}>
                <div
                  className={`${styles.priorityPill} ${styles.high} ${
                    priority === "high" ? styles.selected : ""
                  }`}
                  onClick={() => setPriority("high")}
                >
                  🔴 高優先
                </div>
                <div
                  className={`${styles.priorityPill} ${styles.medium} ${
                    priority === "medium" ? styles.selected : ""
                  }`}
                  onClick={() => setPriority("medium")}
                >
                  🟡 中優先
                </div>
                <div
                  className={`${styles.priorityPill} ${styles.low} ${
                    priority === "low" ? styles.selected : ""
                  }`}
                  onClick={() => setPriority("low")}
                >
                  🟢 低優先
                </div>
              </div>
            </div>

            {/* 指派人員 */}
            <div className={styles.formGroup}>
              <label className={`${styles.formLabel} ${styles.required}`}>
                指派人員
              </label>
              <select
                className={styles.formSelect}
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                required
              >
                <option value="">請選擇指派人員...</option>
                <option value="A">A - 前端工程師</option>
                <option value="B">B - 後端工程師</option>
                <option value="C">C - UI設計師</option>
                <option value="D">D - 專案經理</option>
                <option value="E">E - QA工程師</option>
              </select>
            </div>

            {/* 預計完成日期 */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>預計完成日期</label>
              <div className={styles.dateInput}>
                <input
                  type="date"
                  className={styles.formInput}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            {/* 任務狀態 */}
            <div className={styles.formGroup}>
              <label className={`${styles.formLabel} ${styles.required}`}>
                任務狀態
              </label>
              <select
                className={styles.formSelect}
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as "todo" | "in-progress" | "completed"
                  )
                }
                required
              >
                <option value="todo">待辦事項</option>
                <option value="in-progress">進行中</option>
                <option value="completed">已完成</option>
              </select>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className={styles.modalFooter}>
          <button
            className={`${styles.btn} ${styles.btnSecondary}`}
            type="button"
            onClick={cancel}
          >
            取消
          </button>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            type="submit"
            onClick={submit}
          >
            新增任務
          </button>
        </div>
      </div>
    </div>
  );
}
