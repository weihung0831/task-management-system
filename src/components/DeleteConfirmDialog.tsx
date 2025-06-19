import React from 'react';
import styles from '../styles/DeleteConfirmDialog.module.css';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  taskTitle?: string;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = React.memo(({
  isOpen,
  onConfirm,
  onCancel,
  taskTitle = "此任務"
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.dialogOverlay} onClick={onCancel}>
      <div className={styles.dialogContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.dialogHeader}>
          <div className={styles.warningIcon}>🗑️</div>
          <h3>確認刪除任務</h3>
        </div>
        
        <div className={styles.dialogBody}>
          <p className={styles.message}>您確定要永久刪除任務 <strong className={styles.taskTitle}>「{taskTitle}」</strong> 嗎？</p>
          <p className={styles.warningText}>⚠️ 此操作無法復原，請慎重考慮。</p>
        </div>
        
        <div className={styles.dialogActions}>
          <button 
            className={styles.btnCancel} 
            onClick={onCancel}
          >
            取消
          </button>
          <button 
            className={styles.btnConfirm} 
            onClick={onConfirm}
          >
            確認刪除
          </button>
        </div>
      </div>
    </div>
  );
});

DeleteConfirmDialog.displayName = 'DeleteConfirmDialog';

export default DeleteConfirmDialog;