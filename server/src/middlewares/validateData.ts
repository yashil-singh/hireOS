import { Request, Response, NextFunction } from "express";
import z, { ZodError } from "zod";

const validateData = (schema: z.ZodObject<any, any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);

      next();
    } catch (error) {
      console.log("🚀 ~ validateData.ts:11 ~ error:", error);

      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => issue.message);

        res.status(400).json({
          message: "Validation Error",
          errors: errorMessages,
        });

        return;
      }

      next();
    }
  };
};

export default validateData;
