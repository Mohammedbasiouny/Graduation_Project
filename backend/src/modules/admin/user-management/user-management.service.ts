import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserManagementDto } from './dto/create-user-management.dto';
import { UpdateStudentInfoDto } from './dto/update-student-info.dto';
import { UpdateNonStudentInfoDto } from './dto/update-non-student-info.dto';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { randomBytes } from 'node:crypto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { ResponseHelper } from 'src/response-helper/response-helper';
import { I18nService } from 'nestjs-i18n';
@Injectable()
export class UserManagementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly mail: MailService,
    private readonly responseHelper: ResponseHelper,
    private readonly i18n: I18nService,
  ) { }

  private generateTemporaryPassword(length = 20): string {
    const charset =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=';
    const bytes = randomBytes(length);
    let result = '';

    for (let i = 0; i < length; i++) {
      result += charset[bytes[i] % charset.length];
    }

    return result;
  }

  async createUser(dto: CreateUserManagementDto, lang: string) {
    const normalizedEmail = dto.email.trim().toLowerCase();
    const nationalIdAsBigInt = BigInt(dto.national_id);

    const [existingByEmail, existingByNationalId] = await Promise.all([
      this.prisma.user.findUnique({
        where: { email: normalizedEmail },
        select: { id: true },
      }),
      this.prisma.user.findUnique({
        where: { ssn: nationalIdAsBigInt },
        select: { id: true },
      }),
    ]);

    if (existingByEmail) {
      throw new UnprocessableEntityException({
        status: 'error',
        message: ['Validation failed.'],
        data: null,
        errors: {
          email: [this.i18n.translate('auth.EMAIL_EXISTS')],
        },
      });
    }

    if (existingByNationalId) {
      throw new UnprocessableEntityException({
        status: 'error',
        message: ['Validation failed.'],
        data: null,
        errors: {
          national_id: [this.i18n.translate('auth.SSN_ALREADY_EXISTS')],
        },
      });
    }

    try {
      const temporaryPassword = this.generateTemporaryPassword(20);
      const passwordHash = await argon.hash(temporaryPassword);

      const user = await this.prisma.user.create({
        data: {
          email: normalizedEmail,
          full_name: dto.full_name,
          ssn: nationalIdAsBigInt,
          role: dto.role,
          password_hash: passwordHash,
          isActive: false,
        },
        select: {
          id: true,
          email: true,
          role: true,
        },
      });

      const token = await this.jwt.signAsync(
        {
          id: user.id,
          email: user.email,
        },
        {
          secret: this.config.get('JWT_SECRET'),
          expiresIn: '1h',
        },
      );

      const serverUrl = this.config.get('SERVER_URL') ?? 'http://localhost:3000';
      const activationLink = `${serverUrl}/api/activate?token=${token}`;

      await this.mail.sendActivationMail(user.email, activationLink);

      return this.responseHelper.success(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          verified: false,
        },
        'auth.REGISTER_SUCCESS_CHECK_EMAIL',
        lang,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new UnprocessableEntityException({
          status: 'error',
          message: ['Validation failed.'],
          data: null,
          errors: {
            national_id: [this.i18n.translate('auth.SSN_ALREADY_EXISTS')],
          },
        });
      }

      throw new InternalServerErrorException('auth.REGISTER_FAILED');
    }
  }

  async deleteUser(id: number, lang: string) {
    try {
      await this.prisma.user.delete({
        where: { id },
      });

      return this.responseHelper.success(
        null,
        'common.USER_DELETED_SUCCESS',
        lang,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('common.USER_NOT_FOUND');
      }

      throw new InternalServerErrorException('common.ERROR');
    }
  }

  async toggleUserBlock(id: number, lang: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        end_date: true,
      },
    });

    if (!user) {
      throw new NotFoundException('common.USER_NOT_FOUND');
    }

    const now = new Date();

    const newEndDate = user.end_date ? null : now;

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          end_date: newEndDate,
        },
        select: {
          id: true,
          end_date: true,
        },
      });

      return this.responseHelper.success(
        {
          id: updatedUser.id,
          is_blocked: updatedUser.end_date !== null,
          end_date: updatedUser.end_date ? now : null,
        },
        'common.USER_BLOCK_TOGGLED_SUCCESS',
        lang,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('common.USER_NOT_FOUND');
      }

      throw new InternalServerErrorException('common.ERROR');
    }
  }

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

  async findAllUsers(
    lang: string,
    currentUserId: number,
    options: {
      role?: string;
      isActive?: boolean;
      page: number;
      pageSize: number;
      withPagination: boolean;
    },
  ) {
    try {
      const { role, isActive, page, pageSize, withPagination } = options;

      // ── where ─────────────────────────────────────────
      const where: any = {
        id: {
          not: currentUserId, // exclude myself
        },
      };

      if (role) {
        where.role = role;
      }

      if (isActive !== undefined) {
        where.isActive = isActive;
      }

      // ── statistics ─────────────────────────────────────
      const [
        admin,
        maintenance,
        student,
        medical,
        cafeteria,
        supervisor,
      ] = await this.prisma.$transaction([
        this.prisma.user.count({ where: { role: Role.admin } }),
        this.prisma.user.count({ where: { role: Role.maintenance } }),
        this.prisma.user.count({ where: { role: Role.student } }),
        this.prisma.user.count({ where: { role: Role.medical } }),
        this.prisma.user.count({ where: { role: Role.cafeteria } }),
        this.prisma.user.count({ where: { role: Role.supervisor } }),
      ]);

      const statistics = {
        admin,
        maintenance,
        student,
        medical,
        cafeteria,
        supervisor,
      };

      const select = {
        id: true,
        email: true,
        isActive: true,
        role: true,
        end_date: true,
        created_at: true,
        userPermission: {
          select: { permissions: true },
        },
      };

      // ── WITHOUT PAGINATION ─────────────────────────────
      if (!withPagination) {
        const users = await this.prisma.user.findMany({
          where,
          select,
          orderBy: { created_at: 'desc' },
        });

        return {
          data: {
            users: users.map((u) => ({
              id: u.id,
              email: u.email,
              is_active: u.isActive,
              role: u.role,
              permissions_count: Array.isArray(u.userPermission?.permissions)
                ? (u.userPermission.permissions as string[]).length
                : 0,
              end_date: u.end_date,
              created_at: u.created_at,
            })),
            statistics,
          },
          meta: {
            pagination: {
              page: 1,
              page_size: users.length,
              total_pages: 1,
              total_items: users.length,
            },
            filters: null,
            search: null,
            sorting: null,
          },
        };
      }

      // ── WITH PAGINATION ────────────────────────────────
      const skip = (page - 1) * pageSize;

      const [users, totalItems] = await this.prisma.$transaction([
        this.prisma.user.findMany({
          where,
          select,
          skip,
          take: pageSize,
          orderBy: { created_at: 'desc' },
        }),
        this.prisma.user.count({ where }),
      ]);

      const totalPages = Math.ceil(totalItems / pageSize);

      return {
        data: {
          users: users.map((u) => ({
            id: u.id,
            email: u.email,
            is_active: u.isActive,
            role: u.role,
            permissions_count: Array.isArray(u.userPermission?.permissions)
              ? (u.userPermission.permissions as string[]).length
              : 0,
            end_date: u.end_date,
            created_at: u.created_at,
          })),
          statistics,
        },
        meta: {
          pagination: {
            page,
            page_size: pageSize,
            total_pages: totalPages,
            total_items: totalItems,
          },
          filters: null,
          search: null,
          sorting: null,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException('common.ERROR');
    }
  }

  async updateStudentInfo(
    id: number,
    updateStudentInfoDto: UpdateStudentInfoDto,
    lang: string,
  ) {
    try {
      // Fetch user to verify role is student
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: { id: true, role: true },
      });

      if (!user) {
        throw new NotFoundException('common.USER_NOT_FOUND');
      }

      // Update student info
      await this.prisma.user.update({
        where: { id },
        data: {
          university: updateStudentInfoDto.university,
        },
      });

      return this.responseHelper.success(
        { id },
        'common.USER_INFO_UPDATED_SUCCESS',
        lang,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('common.ERROR');
    }
  }

  async updateNonStudentInfo(
    id: number,
    updateNonStudentInfoDto: UpdateNonStudentInfoDto,
    lang: string,
  ) {
    try {
      // Fetch user to verify it exists and role is not student
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: { id: true, role: true, ssn: true },
      });

      if (!user) {
        throw new NotFoundException('common.USER_NOT_FOUND');
      }

      // Check if national_id is unique (excluding current user)
      const normalizedNationalId = BigInt(updateNonStudentInfoDto.national_id);
      const existingByNationalId = await this.prisma.user.findUnique({
        where: { ssn: normalizedNationalId },
        select: { id: true },
      });

      if (
        existingByNationalId &&
        existingByNationalId.id !== id
      ) {
        throw new UnprocessableEntityException({
          status: 'error',
          message: ['Validation failed.'],
          data: null,
          errors: {
            national_id: [this.i18n.translate('auth.SSN_ALREADY_EXISTS')],
          },
        });
      }

      // Update user info
      await this.prisma.user.update({
        where: { id },
        data: {
          full_name: updateNonStudentInfoDto.full_name,
          ssn: normalizedNationalId,
          role: updateNonStudentInfoDto.role,
        },
      });

      return this.responseHelper.success(
        { id },
        'common.USER_INFO_UPDATED_SUCCESS',
        lang,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new UnprocessableEntityException({
          status: 'error',
          message: ['Validation failed.'],
          data: null,
          errors: {
            national_id: [this.i18n.translate('auth.SSN_ALREADY_EXISTS')],
          },
        });
      }

      throw new InternalServerErrorException('common.ERROR');
    }
  }

  async getUserPermissions(id: number ,lang: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        userPermission: {
          select: { permissions: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('common.USER_NOT_FOUND');
    }

    const permissions = Array.isArray(user.userPermission?.permissions)
      ? user.userPermission.permissions.filter(
        (permission): permission is string => typeof permission === 'string',
      )
      : [];

    return this.responseHelper.success({ permissions  }, 'common.PERMISSIONS_FETCHED', lang);
  }

  async grantPermissions(id: number, permissions: string[], lang: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingUser) {
      throw new NotFoundException('common.USER_NOT_FOUND');
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        userPermission: {
          upsert: {
            update: { permissions },
            create: { permissions },
          },
        },
      },
      select: {
        userPermission: {
          select: { permissions: true },
        },
      },
    });

    const normalizedPermissions = Array.isArray(user.userPermission?.permissions)
      ? user.userPermission.permissions.filter(
        (permission): permission is string => typeof permission === 'string',
      )
      : [];

    return this.responseHelper.success({ permissions: normalizedPermissions } , 'common.PERMISSIONS_GRANTED', lang);
  }
}