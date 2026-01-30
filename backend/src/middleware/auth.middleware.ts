import { Request, Response, NextFunction } from 'express';
import { authService, JwtPayload } from '../services/auth.service';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// Middleware to verify JWT token
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const token = authService.extractTokenFromHeader(req.headers.authorization);

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
    return;
  }

  const payload = authService.verifyToken(token);

  if (!payload) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    });
    return;
  }

  req.user = payload;
  next();
};

// Middleware to check if user has required role
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
};

// Optional authentication - adds user to request if token is valid, but doesn't require it
export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  const token = authService.extractTokenFromHeader(req.headers.authorization);

  if (token) {
    const payload = authService.verifyToken(token);
    if (payload) {
      req.user = payload;
    }
  }

  next();
};
