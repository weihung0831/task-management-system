import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error.message);
  
  res.status(500).json({
    success: false,
    message: '內部伺服器錯誤'
  });
};