import {
    HttpException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { I18nService } from 'nestjs-i18n';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseHelper } from 'src/response-helper/response-helper';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly responseHelper: ResponseHelper,
        private readonly i18n: I18nService,
    ) { }

    async getUserById(id: number, lang: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    email: true,
                    full_name: true,
                    ssn: true,
                    role: true,
                    end_date: true,
                    created_at: true,
                    university: true,
                    userPermission: {
                        select: { permissions: true },
                    },
                },
            });
            if (!user) {
                throw new NotFoundException('common.USER_NOT_FOUND');
            }

            let roleString = '';
            if (user.role === Role.admin) roleString = 'admin';
            else if (user.role === Role.maintenance) roleString = 'maintenance';
            else if (user.role === Role.student) roleString = 'student';
            else if (user.role === Role.medical) roleString = 'medical';
            else if (user.role === Role.cafeteria) roleString = 'cafeteria';
            else if (user.role === Role.supervisor) roleString = 'supervisor';

            const formatDate = (date: Date | null | undefined): string | null => {
                if (!date) return null;
                return date instanceof Date ? date.toISOString() : null;
            };

            if (user.role === Role.student) {
                return this.responseHelper.success(
                    {
                        id: user.id,
                        email: user.email,
                        university: user.university,
                        role: roleString,
                        end_date: formatDate(user.end_date),
                        created_at: formatDate(user.created_at),
                    },
                    'common.USER_FETCHED_SUCCESS',
                    lang,
                );
            }

            return this.responseHelper.success(
                {
                    id: user.id,
                    email: user.email,
                    full_name: user.full_name,
                    national_id: user.ssn ? user.ssn.toString() : null,
                    role: roleString,
                    permissions: user.userPermission?.permissions ?? [],
                    created_at: formatDate(user.created_at),
                    end_date: formatDate(user.end_date),
                },
                'common.USER_FETCHED_SUCCESS',
                lang,
            );
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new InternalServerErrorException('common.ERROR');
        }
    }

    async returnUserEmail(userId: number, lang: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { email: true },
        });
        if (!user) {
            throw new NotFoundException('common.USER_NOT_FOUND');
        }

        if (!user.email) {
            throw new NotFoundException('common.EMAIL_NOT_FOUND');
        }

        return this.responseHelper.success({ email: user.email }, 'auth.EMAIL_RETRIEVED', lang);
    }
}
