import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// We extend the Request type to include the userId once verified
export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Get the token from the Header (Authorization: Bearer <token>)
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { userId: string };
    
    // Attach the userId to the request object so our routes know who is calling
    req.userId = decoded.userId;
    
    // Move to the next function (the actual logic)
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};