// src/common/file.service.ts
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  createDirectory(dirPath: string) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  moveFile(tempPath: string, destPath: string) {
    fs.renameSync(tempPath, destPath);
  }

  deleteFile(filePath: string) {
    const fullPath = filePath.startsWith('/')
      ? path.join(process.cwd(), filePath)
      : filePath;

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }


  deleteDirectory(dirPath: string) {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
    }
  }

  saveFile(
    file: Express.Multer.File | undefined,
    studentId: number,
    type: string,
  ) {
    if (!file) return null;

    const studentDir = path.join(
      process.cwd(),
      'uploads',
      'students',
      `${studentId}`,
    );
    this.createDirectory(studentDir);

    const ext = path.extname(file.originalname);
    const filename = `${type}${ext}`;
    const finalPath = path.join(studentDir, filename);

    this.moveFile(file.path, finalPath);

    return {
      relativePath: `/uploads/students/${studentId}/${filename}`,
      absolutePath: finalPath,
    };
  }
}
