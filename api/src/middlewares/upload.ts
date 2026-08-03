import { NextFunction, Request, RequestHandler, Response } from "express";
import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new ApiError(422, "VALIDATION_ERROR", "Unsupported file type"));
  },
});

export function uploadSingle(field: string): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    upload.single(field)(req, res, (err: unknown) => {
      if (err instanceof multer.MulterError) {
        next(new ApiError(422, "VALIDATION_ERROR", err.message));
        return;
      }
      next(err);
    });
  };
}
