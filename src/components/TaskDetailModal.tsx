import React, { useEffect, useState, useCallback } from "react";
import styles from "../styles/TaskDetailModal.module.css";
import type { Task } from "../App";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import ConfirmDialog from "./ConfirmDialog";
import { taskFormSchema } from "../utils/validation";
import { useFormValidation } from "../hooks/useFormValidation";

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete?: (taskId: string) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = React.memo(
  ({ isOpen, onClose, task, onTaskUpdate, onTaskDelete }) => {
    // 表單狀態管理
    const [formData, setFormData] = useState({
      title: "",
      description: "",
      status: "todo" as Task["status"],
      priority: "medium" as Task["priority"],
      assignee: "",
      dueDate: "",
    });

    const [hasChanges, setHasChanges] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);

    // 使用表單驗證 Hook
    const { errors, validateFormData, clearFieldError, clearAllErrors } = useFormValidation({
      schema: taskFormSchema,
    });

    // 處理關閉（檢查是否有未保存的變更）
    const handleClose = useCallback(() => {
      if (hasChanges) {
        setShowCloseConfirm(true);
        return;
      }
      onClose();
    }, [hasChanges, onClose]);

    // 確認關閉
    const handleConfirmClose = useCallback(() => {
      setShowCloseConfirm(false);
      onClose();
    }, [onClose]);

    // 取消關閉
    const handleCancelClose = useCallback(() => {
      setShowCloseConfirm(false);
    }, []);

    // 當task變化時重置表單
    useEffect(() => {
      if (task) {
        const newFormData = {
          title: task.title,
          description: task.description || "",
          status: task.status,
          priority: task.priority,
          assignee: task.assignee,
          dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
        };
        setFormData(newFormData);
        setHasChanges(false);
        clearAllErrors();
      }
    }, [task, clearAllErrors]);

    // ESC鍵關閉功能
    useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          handleClose();
        }
      };

      if (isOpen) {
        document.addEventListener("keydown", handleEscape);
        // 防止背景滾動
        document.body.style.overflow = "hidden";
      }

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
      };
    }, [isOpen, handleClose]);

    if (!isOpen || !task) return null;

    // 表單驗證
    const validateForm = () => {
      return validateFormData(formData);
    };

    // 處理表單欄位變更
    const handleFieldChange = (field: string, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      setHasChanges(true);

      // 清除該欄位的錯誤訊息
      if (errors[field]) {
        clearFieldError(field);
      }
    };

    // 處理保存
    const handleSave = () => {
      if (!validateForm()) return;

      const updates: Partial<Task> = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        priority: formData.priority,
        assignee: formData.assignee,
        dueDate: formData.dueDate || undefined,
      };

      onTaskUpdate?.(task.id, updates);
      setHasChanges(false);
      onClose();
    };

    // 處理刪除
    const handleDelete = () => {
      onTaskDelete?.(task.id);
      setShowDeleteDialog(false);
      onClose();
    };

    return (
      <div
        className={styles.modalOverlay}
        onClick={handleClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className={styles.taskModal} onClick={(e) => e.stopPropagation()}>
          {/* Modal Header */}
          <div className={styles.modalHeader}>
            <h2>
              任務詳情{" "}
              {hasChanges && <span className={styles.unsavedIndicator}>*</span>}
            </h2>
            <button className={styles.closeButton} onClick={handleClose}>
              ×
            </button>
          </div>

          {/* Modal Content */}
          <div className={styles.modalContent}>
            {/* Main Section (70%) */}
            <div className={styles.mainSection}>
              {/* Task Title */}
              <div className={styles.formGroup}>
                <label>任務標題 *</label>
                <input
                  type="text"
                  className={`${styles.titleInput} ${
                    errors.title ? styles.inputError : ""
                  }`}
                  value={formData.title}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  placeholder="輸入任務標題"
                />
                {errors.title && (
                  <span className={styles.errorText}>{errors.title}</span>
                )}
              </div>

              {/* Task Description */}
              <div className={styles.formGroup}>
                <label>任務描述</label>
                <textarea
                  className={`${styles.descriptionTextarea} ${
                    errors.description ? styles.inputError : ""
                  }`}
                  rows={6}
                  value={formData.description}
                  onChange={(e) =>
                    handleFieldChange("description", e.target.value)
                  }
                  placeholder="輸入任務描述"
                />
                {errors.description && (
                  <span className={styles.errorText}>{errors.description}</span>
                )}
              </div>
            </div>

            {/* Sidebar (30%) */}
            <div className={styles.sidebar}>
              {/* Status */}
              <div className={styles.formGroup}>
                <label>📋 狀態</label>
                <select
                  className={styles.statusSelect}
                  value={formData.status}
                  onChange={(e) => handleFieldChange("status", e.target.value)}
                >
                  <option value="todo">待辦事項</option>
                  <option value="in-progress">進行中</option>
                  <option value="completed">已完成</option>
                </select>
              </div>

              {/* Priority */}
              <div className={styles.formGroup}>
                <label>⭐ 優先級</label>
                <select
                  className={styles.prioritySelect}
                  value={formData.priority}
                  onChange={(e) =>
                    handleFieldChange("priority", e.target.value)
                  }
                >
                  <option value="high">高優先級</option>
                  <option value="medium">中優先級</option>
                  <option value="low">低優先級</option>
                </select>
              </div>

              {/* Assignee */}
              <div className={styles.formGroup}>
                <label>👤 負責人</label>
                <select
                  className={styles.assigneeSelect}
                  value={formData.assignee}
                  onChange={(e) =>
                    handleFieldChange("assignee", e.target.value)
                  }
                >
                  <option value="A">開發者 A</option>
                  <option value="B">開發者 B</option>
                  <option value="C">開發者 C</option>
                  <option value="D">開發者 D</option>
                  <option value="E">開發者 E</option>
                  <option value="F">開發者 F</option>
                </select>
              </div>

              {/* Due Date */}
              <div className={styles.formGroup}>
                <label>📅 到期日</label>
                <input
                  type="date"
                  className={styles.dueDateInput}
                  value={formData.dueDate}
                  onChange={(e) => handleFieldChange("dueDate", e.target.value)}
                />
              </div>

              {/* Time Info */}
              <div className={styles.timeInfo}>
                <h4>🕐 時間資訊</h4>
                <div className={styles.timeItem}>
                  <span>建立:</span>
                  <span>2025/06/17</span>
                </div>
                <div className={styles.timeItem}>
                  <span>更新:</span>
                  <span>2025/06/17</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className={styles.modalActions}>
            <button
              className={styles.btnPrimary}
              onClick={handleSave}
              disabled={!hasChanges}
            >
              保存變更
            </button>
            <button className={styles.btnSecondary} onClick={handleClose}>
              取消
            </button>
            <button
              className={styles.btnDanger}
              onClick={() => setShowDeleteDialog(true)}
            >
              刪除任務
            </button>
          </div>

          {/* Delete Confirmation Dialog */}
          <DeleteConfirmDialog
            isOpen={showDeleteDialog}
            onConfirm={handleDelete}
            onCancel={() => setShowDeleteDialog(false)}
            taskTitle={task.title}
          />

          {/* Close Confirmation Dialog */}
          <ConfirmDialog
            isOpen={showCloseConfirm}
            title="未保存的變更"
            message="您有未保存的變更，確定要關閉嗎？所有變更將會遺失。"
            confirmText="確定關閉"
            cancelText="繼續編輯"
            type="warning"
            onConfirm={handleConfirmClose}
            onCancel={handleCancelClose}
          />
        </div>
      </div>
    );
  }
);

TaskDetailModal.displayName = "TaskDetailModal";

export default TaskDetailModal;
