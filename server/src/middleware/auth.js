import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const protect = async (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized, token missing' });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
    
    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    return res.status(401).json({ success: false, error: 'Not authorized, token invalid' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Forbidden, insufficient permissions' });
    }
    next();
  };
};
