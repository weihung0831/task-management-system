import React, { useState } from 'react';

// 僅用於開發環境測試錯誤邊界的組件
const ErrorTestComponent: React.FC = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('這是一個測試錯誤：測試錯誤邊界功能');
  }

  // 僅在開發環境下顯示
  if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: '#ff6b6b',
      color: 'white',
      padding: '10px 15px',
      borderRadius: '6px',
      fontSize: '12px',
      cursor: 'pointer',
      zIndex: 9999,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
    }}
    onClick={() => setShouldThrow(true)}
    >
      🐛 測試錯誤邊界
    </div>
  );
};

export default ErrorTestComponent;