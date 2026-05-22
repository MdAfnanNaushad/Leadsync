import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError, ZodRawShape } from "zod";

export const validateRequest = (schema: ZodObject<ZodRawShape>) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Parse and validate incoming data structures against the active Zod schema
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Map through structural errors to send a clean, highly readable breakdown back to the UI
        // ZodError uses `issues` (array of ZodIssue) rather than `errors`
        const formattedErrors = error.issues.map((err) => ({
          field: err.path.slice(1).join("."), // Removes the root 'body' prefix from formatting paths
          message: err.message,
        }));

        res.status(400).json({
          status: "fail",
          error: "Validation failed",
          details: formattedErrors,
        });
        return;
      }
      next(error);
    }
  };
};
