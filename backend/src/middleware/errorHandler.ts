import { Request, Response, NextFunction } from 'express';

interface ErrorResponse {
  success: false;
  message: string;
  errors?: any[];
  stack?: string;
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  const response: ErrorResponse = {
    success: false,
    message: err.message || 'Sunucu hatası',
  };

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    response.message = 'Dogrulama hatası';
    response.errors = Object.values(err.errors).map((e: any) => ({
      field: e.path,
      message: e.message,
    }));
    res.status(400).json(response);
    return;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    response.message = `Bu ${field} zaten kullanılıyor`;
    res.status(400).json(response);
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    response.message = 'Geçersiz token';
    res.status(401).json(response);
    return;
  }

  if (err.name === 'TokenExpiredError') {
    response.message = 'Token süresi dolmuş';
    res.status(401).json(response);
    return;
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    response.message = 'Geçersiz ID formatı';
    res.status(400).json(response);
    return;
  }

  // Development mode - include stack trace
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(err.statusCode || 500).json(response);
};

export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: 'Endpoint bulunamadı',
  });
};
