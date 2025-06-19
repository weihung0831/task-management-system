import { useState, useCallback } from 'react';
import { validateForm, validateField } from '../utils/validation';
import type { ValidationSchema } from '../utils/validation';

interface UseFormValidationOptions {
  schema: ValidationSchema;
  onValidationChange?: (isValid: boolean) => void;
}

export const useFormValidation = (options: UseFormValidationOptions) => {
  const { schema, onValidationChange } = options;
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 驗證整個表單
  const validateFormData = useCallback((data: Record<string, unknown>) => {
    const result = validateForm(data, schema);
    setErrors(result.errors);
    onValidationChange?.(result.isValid);
    return result.isValid;
  }, [schema, onValidationChange]);

  // 驗證單個欄位
  const validateSingleField = useCallback((fieldName: string, value: unknown) => {
    const fieldRules = schema[fieldName];
    if (!fieldRules) return true;

    const error = validateField(value, fieldRules);
    setErrors(prev => ({
      ...prev,
      [fieldName]: error || '',
    }));

    return !error;
  }, [schema]);

  // 清除欄位錯誤
  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: '',
    }));
  }, []);

  // 清除所有錯誤
  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  // 檢查是否有錯誤
  const hasErrors = Object.values(errors).some(error => error.length > 0);

  return {
    errors,
    validateFormData,
    validateSingleField,
    clearFieldError,
    clearAllErrors,
    hasErrors,
  };
};