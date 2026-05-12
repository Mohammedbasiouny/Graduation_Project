// src/common/cleanup.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';

@Injectable()
export class CleanupMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const originalSend = res.send;
    const files = (req as any).uploadedFiles; 

    res.send = function (body?: any) {
      if (files) {
        Object.values(files)
          .flat()
          .forEach((file: any) => {
            const filePath = file.path;
            if (fs.existsSync(filePath)) {
              try {
                fs.unlinkSync(filePath);
              } catch (err) {
                console.error('Failed to delete temp file:', err);
              }
            }
          });
      }
      return originalSend.call(this, body);
    };

    next();
  }
}
