import React, { Component, ReactNode } from 'react';
import styles from '../styles/ErrorBoundary.module.css';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // 更新 state 以便下一次渲染能夠顯示降級後的 UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 你可以將錯誤記錄到錯誤收集服務
    console.error('錯誤邊界捕獲到錯誤:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // 可以在這裡發送錯誤到監控服務
    // sendErrorToMonitoringService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // 如果有自定義的 fallback UI，使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默認的錯誤 UI
      return (
        <div className={styles.errorBoundary}>
          <div className={styles.errorContainer}>
            <div className={styles.errorIcon}>⚠️</div>
            <h2 className={styles.errorTitle}>哎呀！出現了一些問題</h2>
            <p className={styles.errorMessage}>
              應用程式遇到了意外錯誤。我們已經記錄了這個問題，稍後會進行修復。
            </p>
            
            {/* 開發環境下顯示詳細錯誤信息 */}
            {typeof process !== 'undefined' && process.env.NODE_ENV === 'development' && this.state.error && (
              <details className={styles.errorDetails}>
                <summary className={styles.errorSummary}>錯誤詳情（開發模式）</summary>
                <div className={styles.errorContent}>
                  <h4>錯誤訊息：</h4>
                  <pre className={styles.errorText}>{this.state.error.message}</pre>
                  
                  <h4>錯誤堆疊：</h4>
                  <pre className={styles.errorText}>{this.state.error.stack}</pre>
                  
                  {this.state.errorInfo && (
                    <>
                      <h4>組件堆疊：</h4>
                      <pre className={styles.errorText}>{this.state.errorInfo.componentStack}</pre>
                    </>
                  )}
                </div>
              </details>
            )}

            <div className={styles.errorActions}>
              <button 
                className={styles.btnPrimary} 
                onClick={this.handleReset}
              >
                重試
              </button>
              <button 
                className={styles.btnSecondary} 
                onClick={this.handleReload}
              >
                重新載入頁面
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;