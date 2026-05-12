import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { FileService } from "src/common/file-service/file.service";
import { ValidationErrorHelper } from "./validation-error.helper";

@Injectable()
export class DocumentHelper {
    constructor(private readonly fileService: FileService) { }

    async replaceSingle(
        tx: Prisma.TransactionClient,
        studentId: number,
        type: string,
        file?: Express.Multer.File,
        uploadedFiles?: string[],
    ): Promise<void> {
        if (!file) return;

        const oldDoc = await tx.document.findFirst({
            where: {
                student_id: studentId,
                document_type: type,
            },
        });

        if (oldDoc) {
            try {
                this.fileService.deleteFile(oldDoc.file_path);
            } catch (e) {
                console.error(`Failed to delete old ${type} file`, e);
            }

            await tx.document.delete({
                where: { id: oldDoc.id },
            });
        }

        const saved = this.fileService.saveFile(file, studentId, type);

        if (!saved?.absolutePath || !saved?.relativePath) {
            throw new InternalServerErrorException(
                'student.FILE_UPLOAD_FAILED',
            );
        }

        uploadedFiles?.push(saved.absolutePath);

        await tx.document.create({
            data: {
                student_id: studentId,
                document_type: type,
                file_path: saved.relativePath,
            },
        });
    }

    async requireDocumentExists(
        tx: Prisma.TransactionClient,
        studentId: number,
        type: string,
        errorKey: string,
    ): Promise<void> {
        const doc = await tx.document.findFirst({
            where: { student_id: studentId, document_type: type },
        });
        if (!doc) {
            ValidationErrorHelper.field(type, errorKey);
        }
    }

    deleteFile(filePath: string): void {
        this.fileService.deleteFile(filePath);
    }

    saveFile(
        file: Express.Multer.File,
        studentId: number,
        type: string,
    ): { absolutePath: string; relativePath: string } {
        const saved = this.fileService.saveFile(file, studentId, type);

        if (!saved?.absolutePath || !saved?.relativePath) {
            throw new InternalServerErrorException('student.FILE_UPLOAD_FAILED');
        }

        return saved;
    }

    rollback(uploadedFiles: string[]): void {
        uploadedFiles.forEach((p) => {
            try { this.fileService.deleteFile(p); } catch { }
        });
    }
}