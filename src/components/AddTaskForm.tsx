import React, { useState } from 'react';
import { taskFormSchema } from '../utils/validation';
import { useFormValidation } from '../hooks/useFormValidation';
import type { Task } from '../App';

interface AddTaskFormProps {
  onSubmit: (taskData: Omit<Task, 'id'>) => void;
  onCancel: () => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as Task['status'],
    priority: 'medium' as Task['priority'],
    assignee: '',
    dueDate: '',
  });

  // 使用相同的驗證邏輯
  const { errors, validateFormData, clearFieldError } = useFormValidation({
    schema: taskFormSchema,
  });

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // 清除該欄位的錯誤訊息
    if (errors[field]) {
      clearFieldError(field);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateFormData(formData)) {
      onSubmit({
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        priority: formData.priority,
        assignee: formData.assignee,
        dueDate: formData.dueDate || undefined,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>任務標題 *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleFieldChange('title', e.target.value)}
          placeholder="輸入任務標題"
        />
        {errors.title && <span style={{ color: 'red' }}>{errors.title}</span>}
      </div>

      <div>
        <label>任務描述</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          placeholder="輸入任務描述"
        />
        {errors.description && <span style={{ color: 'red' }}>{errors.description}</span>}
      </div>

      <div>
        <label>優先級</label>
        <select
          value={formData.priority}
          onChange={(e) => handleFieldChange('priority', e.target.value)}
        >
          <option value="high">高優先級</option>
          <option value="medium">中優先級</option>
          <option value="low">低優先級</option>
        </select>
      </div>

      <div>
        <label>負責人</label>
        <select
          value={formData.assignee}
          onChange={(e) => handleFieldChange('assignee', e.target.value)}
        >
          <option value="">請選擇負責人</option>
          <option value="A">開發者 A</option>
          <option value="B">開發者 B</option>
          <option value="C">開發者 C</option>
          <option value="D">開發者 D</option>
          <option value="E">開發者 E</option>
          <option value="F">開發者 F</option>
        </select>
      </div>

      <div>
        <button type="submit">新增任務</button>
        <button type="button" onClick={onCancel}>取消</button>
      </div>
    </form>
  );
};

export default AddTaskForm;