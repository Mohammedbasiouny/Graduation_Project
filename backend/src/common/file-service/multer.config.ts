import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.resolve('uploads/tmp');
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix =
        Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),

  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'application/pdf',
    ];

    const ext = path.extname(file.originalname).toLowerCase();

    if (
      !allowedExtensions.includes(ext) ||
      !allowedMimeTypes.includes(file.mimetype)
    ) {
      return cb(
        new BadRequestException('File type not allowed'),
        false,
      );
    }

    cb(null, true);
  },
};
