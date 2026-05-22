import { Request, Response, NextFunction } from 'express';

// Wraps an asynchronous express route handler function and pipes errors straight to next()
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: any) => next(err));
  };
};