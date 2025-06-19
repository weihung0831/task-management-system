import { useCallback } from 'react';

interface ErrorHandlerOptions {
  onError?: (error: Error, errorInfo?: string) => void;
  showToast?: boolean;
}

export const useErrorHandler = (options: ErrorHandlerOptions = {}) => {
  const { onError, showToast = true } = options;

  const handleError = useCallback((error: Error, context?: string) => {
    // 記錄錯誤到控制台
    console.error('錯誤處理器捕獲到錯誤:', error);
    if (context) {
      console.error('錯誤上下文:', context);
    }

    // 呼叫自定義錯誤處理函數
    onError?.(error, context);

    // 如果需要，可以在這裡顯示 toast 通知
    if (showToast) {
      // 這裡可以整合 toast 通知系統
      console.warn('顯示錯誤通知:', error.message);
    }

    // 可以在這裡發送錯誤到監控服務
    // sendErrorToService(error, context);
  }, [onError, showToast]);

  const handleAsyncError = useCallback(async (asyncFn: () => Promise<void>, context?: string) => {
    try {
      await asyncFn();
    } catch (error) {
      handleError(error instanceof Error ? error : new Error(String(error)), context);
    }
  }, [handleError]);

  const withErrorHandler = useCallback(<T extends unknown[], R>(
    fn: (...args: T) => R,
    context?: string
  ) => {
    return (...args: T): R | undefined => {
      try {
        return fn(...args);
      } catch (error) {
        handleError(error instanceof Error ? error : new Error(String(error)), context);
        return undefined;
      }
    };
  }, [handleError]);

  return {
    handleError,
    handleAsyncError,
    withErrorHandler,
  };
};