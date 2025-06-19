import React from 'react';
import styles from '../styles/ConfirmDialog.module.css';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'warning' | 'danger' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = React.memo(({
  isOpen,
  title,
  message,
  confirmText = '確認',
  cancelText = '取消',
  onConfirm,
  onCancel,
  type = 'warning'
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'danger':
        return '🚨';
      case 'info':
        return 'ℹ️';
      default:
        return '⚠️';
    }
  };

  return (
    <div className={styles.dialogOverlay} onClick={onCancel}>
      <div className={styles.dialogContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.dialogHeader}>
          <div className={`${styles.icon} ${styles[type]}`}>
            {getIcon()}
          </div>
          <h3 className={styles.title}>{title}</h3>
        </div>
        
        <div className={styles.dialogBody}>
          <p className={styles.message}>{message}</p>
        </div>
        
        <div className={styles.dialogActions}>
          <button 
            className={styles.btnCancel} 
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            className={`${styles.btnConfirm} ${styles[type]}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
});

ConfirmDialog.displayName = 'ConfirmDialog';

export default ConfirmDialog;