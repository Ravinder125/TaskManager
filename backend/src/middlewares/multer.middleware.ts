import multer, { type FileFilterCallback } from "multer";
import { randomBytes } from "crypto";
import type { Request } from "express";
import type { Multer } from "multer";

/* =======================
   Storage
======================= */

const storage = multer.diskStorage({
    destination(
        _req: Request,
        _file: Express.Multer.File,
        cb
    ) {
        cb(null, "./public/temp");
    },

    filename(
        _req: Request,
        file: Express.Multer.File,
        cb
    ) {
        const randomByte = randomBytes(16).toString("hex");
        cb(null, `${randomByte}-${file.originalname}`);
    },
});

/* =======================
   File filter
======================= */

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
): void => {
    const allowedTypes = [
        "image/jpg",
        "image/jpeg",
        "image/png",
        "image/webp",
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Invalid file type. Only JPG, JPEG, PNG and WEBP formats are allowed"
            )
        );
    }
};

/* =======================
   Upload middleware
======================= */

export const upload: Multer = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
    },
});
