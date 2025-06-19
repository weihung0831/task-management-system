// 驗證規則類型定義
export interface ValidationRule {
  validator: (value: unknown) => boolean;
  message: string;
}

export interface ValidationSchema {
  [fieldName: string]: ValidationRule[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// 基礎驗證規則
export const validationRules = {
  // 必填欄位
  required: (message = '此欄位為必填項目'): ValidationRule => ({
    validator: (value: unknown) => {
      return typeof value === 'string' && value.trim().length > 0;
    },
    message,
  }),

  // 最小長度
  minLength: (min: number, message?: string): ValidationRule => ({
    validator: (value: unknown) => {
      if (typeof value !== 'string') return true;
      return !value || value.length >= min;
    },
    message: message || `至少需要 ${min} 個字符`,
  }),

  // 最大長度
  maxLength: (max: number, message?: string): ValidationRule => ({
    validator: (value: unknown) => {
      if (typeof value !== 'string') return true;
      return !value || value.length <= max;
    },
    message: message || `不能超過 ${max} 個字符`,
  }),

  // 字符長度範圍
  lengthRange: (min: number, max: number, message?: string): ValidationRule => ({
    validator: (value: unknown) => {
      if (typeof value !== 'string' || !value) return true;
      return value.length >= min && value.length <= max;
    },
    message: message || `長度必須在 ${min} 到 ${max} 個字符之間`,
  }),

  // 電子郵件格式
  email: (message = '請輸入有效的電子郵件地址'): ValidationRule => ({
    validator: (value: unknown) => {
      if (typeof value !== 'string' || !value) return true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    message,
  }),

  // 自定義驗證
  custom: (validator: (value: unknown) => boolean, message: string): ValidationRule => ({
    validator,
    message,
  }),
};

// 任務相關的驗證規則
export const taskValidationRules = {
  title: [
    validationRules.required('任務標題為必填項目'),
    validationRules.maxLength(100, '任務標題不能超過100個字符'),
  ],
  description: [
    validationRules.maxLength(1000, '任務描述不能超過1000個字符'),
  ],
  assignee: [
    validationRules.required('請選擇負責人'),
  ],
};

// 驗證函數
export const validateField = (value: unknown, rules: ValidationRule[]): string | null => {
  for (const rule of rules) {
    if (!rule.validator(value)) {
      return rule.message;
    }
  }
  return null;
};

export const validateForm = (data: Record<string, unknown>, schema: ValidationSchema): ValidationResult => {
  const errors: Record<string, string> = {};

  for (const [fieldName, rules] of Object.entries(schema)) {
    const fieldValue = data[fieldName];
    const error = validateField(fieldValue, rules);
    if (error) {
      errors[fieldName] = error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// 實時驗證 Hook 的輔助函數
export const createValidationHook = (schema: ValidationSchema) => {
  return (data: Record<string, unknown>) => {
    return validateForm(data, schema);
  };
};

// 任務表單的驗證 schema
export const taskFormSchema: ValidationSchema = {
  title: taskValidationRules.title,
  description: taskValidationRules.description,
};

// 便捷的任務驗證函數
export const validateTaskForm = (formData: {
  title: string;
  description: string;
  [key: string]: unknown;
}): ValidationResult => {
  return validateForm(formData, taskFormSchema);
};