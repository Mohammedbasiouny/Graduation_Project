import {
    HttpException,
    Injectable,
    InternalServerErrorException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { readFile } from 'node:fs/promises';

@Injectable()
export class EgyptianIdValidator {
    constructor(private readonly i18n: I18nService) { }

    async assertFrontImage(
        file: Express.Multer.File,
        fieldKey: string,
    ): Promise<void> {
        const serviceBase = process.env.SERVICE_URL;
        const endpoint = `${serviceBase.replace(/\/+$/, '')}/check-egyptian-id/`;
        const invalidImageMessage = this.i18n.translate(
            'student.INVALID_EGYPTIAN_ID_FRONT_IMAGE',
        );

        try {
            const fileBuffer = await this.getUploadedFileBuffer(file);
            const formData = new FormData();
            const imageBlob = new Blob([new Uint8Array(fileBuffer)], {
                type: file.mimetype || 'application/octet-stream',
            });

            formData.append('file', imageBlob, file.originalname || 'id-front-image.jpg');

            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                let details = '';
                try {
                    details = await response.text();
                } catch {
                    details = '';
                }

                if (response.status >= 400 && response.status < 500) {
                    throw new UnprocessableEntityException({
                        status: 'error',
                        message: [invalidImageMessage],
                        data: null,
                        errors: {
                            [fieldKey]: [details || invalidImageMessage],
                        },
                    });
                }

                throw new InternalServerErrorException(
                    'student.ID_CARD_VALIDATION_SERVICE_ERROR',
                );
            }

            const result = (await response.json()) as { is_egyptian?: boolean };

            if (result?.is_egyptian !== true) {
                throw new UnprocessableEntityException({
                    status: 'error',
                    message: [invalidImageMessage],
                    data: null,
                    errors: {
                        [fieldKey]: [invalidImageMessage],
                    },
                });
            }
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(
                'student.ID_CARD_VALIDATION_SERVICE_ERROR',
            );
        }
    }

    private async getUploadedFileBuffer(
        file: Express.Multer.File,
    ): Promise<Buffer> {
        if (file.buffer?.length) {
            return file.buffer;
        }

        if (file.path) {
            return readFile(file.path);
        }

        throw new InternalServerErrorException('student.FILE_UPLOAD_FAILED');
    }
}