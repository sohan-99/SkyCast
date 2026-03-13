import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";

export function validateBody(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      const zodError = error as ZodError;
      return res.status(400).json({
        message: "Validation failed",
        errors: zodError.errors.map((issue) => ({ path: issue.path.join("."), message: issue.message }))
      });
    }
  };
}
