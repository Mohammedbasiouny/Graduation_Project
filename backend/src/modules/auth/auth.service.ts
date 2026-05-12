import {
  Injectable,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
  ServiceUnavailableException,
  UnprocessableEntityException,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  SigninDto,
  ForgotPassDto,
  ResetPassDto,
  SignupDto,
  CheckOtp,
  ResendAvtivationAccountDto,
  ChangePassDto,
} from './dto';
import { ResponseHelper } from '../../response-helper/response-helper';
import { MailService } from 'src/mail/mail.service';
import { I18nService } from 'nestjs-i18n';


@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private readonly responseHelper: ResponseHelper,
    private mail: MailService,
    private readonly i18n: I18nService,
  ) { }

  // ==================== SIGNUP ====================
  async signup(dto: SignupDto, lang: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new UnprocessableEntityException({
        status: 'error',
        message: ['Validation failed.'],
        data: null,
        errors: {
          email: [this.i18n.translate('auth.EMAIL_ALREADY_EXISTS')],
        },
      });
    }

    try {
      const hash = await argon.hash(dto.password);

      const user = await this.prisma.user.create({
        data: {
          password_hash: hash,
          role: 'student',
          email: dto.email,
          isActive: false,
          university: dto.university,
        },
      });

      const token = await this.jwt.signAsync(
        {
          id: user.id,
          email: user.email,
        },
        { secret: this.config.get('JWT_SECRET'), expiresIn: '1h' },
      );

      const serverUrl = this.config.get('SERVER_URL') ?? 'http://localhost:3000';
      const activationLink = `${serverUrl}/api/activate?token=${token}`;
      await this.mail.sendActivationMail(dto.email, activationLink);

      return this.responseHelper.success(
        null,
        'auth.REGISTER_SUCCESS_CHECK_EMAIL',
        lang,
      );
    } catch (error) {
      console.error('Signup Technical Error:', error);
      throw new InternalServerErrorException('auth.REGISTER_FAILED');
    }
  }

  // ==================== Resend Activate Account ====================
  async resendActivation(dto: ResendAvtivationAccountDto, lang: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new NotFoundException('common.USER_NOT_FOUND');
    }

    if (user.isActive) {
      throw new ConflictException('auth.ACCOUNT_ALREADY_ACTIVE');
    }

    try {
      const token = await this.jwt.signAsync(
        {
          id: user.id,
          email: user.email,
        },
        { secret: this.config.get('JWT_SECRET'), expiresIn: '1h' },
      );

      const serverUrl = this.config.get('SERVER_URL') ?? 'http://localhost:3000';
      const activationLink = `${serverUrl}/api/activate?token=${token}`;

      await this.mail.sendActivationMail(dto.email, activationLink);

      return this.responseHelper.success(
        null,
        'auth.RESEND_ACTIVATION_SUCCESS',
        lang,
      );
    } catch (error) {
      console.error('Resend Activation Error:', error);
      throw new ServiceUnavailableException('auth.RESEND_ACTIVATION_FAILED');
    }
  }

  // ==================== ACTIVATE ACCOUNT ====================
  async activateAccount(token: string): Promise<{
    status: 'success' | 'already_active' | 'invalid' | 'expired';
    email?: string;
  }> {
    let payload: any;
    let emailFromPayload: string | null = null;

    try {
      payload = this.jwt.verify(token, {
        secret: this.config.get('JWT_SECRET'),
      });
      emailFromPayload = payload.email || null;
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        try {
          const decoded = this.jwt.decode(token);
          emailFromPayload = decoded?.email || null;
        } catch {
          emailFromPayload = null;
        }
        return { status: 'expired', email: emailFromPayload || undefined };
      }
      return { status: 'invalid' };
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
      select: { email: true, isActive: true },
    });

    if (!user) return { status: 'invalid' };

    if (user.isActive) {
      return { status: 'already_active', email: user.email };
    }

    await this.prisma.user.update({
      where: { id: payload.id },
      data: { isActive: true },
    });

    return { status: 'success', email: user.email };
  }

  // ==================== SIGNIN ====================
  async signin(dto: SigninDto, lang: string) {

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: {
        id: true,
        email: true,
        password_hash: true,
        role: true,
        university: true,
        isActive: true,
        end_date: true,
      },
    });

    if (!user) throw new UnauthorizedException('auth.INVALID_CREDENTIALS');

    try {
      const pwMatches = await argon.verify(user.password_hash, dto.password);
      if (!pwMatches) throw new UnauthorizedException('auth.INVALID_CREDENTIALS');

      if (user.end_date) {
        throw new UnprocessableEntityException({
          status: 'error',
          message: ['Validation failed.'],
          data: null,
          errors: {
            email: [this.i18n.translate('auth.ACCOUNT_BLOCKED')],
          },
        });
      }

      if (!user.isActive) throw new ForbiddenException('auth.ACCOUNT_NOT_ACTIVE');

      const userWithPermissions = await this.prisma.user.findUnique({
        where: { id: user.id },
        select: {
          userPermission: {
            select: { permissions: true },
          },
        },
      });

      const permissions = Array.isArray(userWithPermissions?.userPermission?.permissions)
        ? userWithPermissions.userPermission.permissions.filter(
          (permission): permission is string => typeof permission === 'string',
        )
        : [];

      const token = await this.signToken(
        user.id,
        user.email,
        user.role,
        user.university,
        permissions,
      );

      return this.responseHelper.success(token, 'auth.LOGIN_SUCCESS', lang);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Signin Technical Error:', error);
      throw new InternalServerErrorException('auth.LOGIN_FAILED');
    }
  }

  // ==================== FORGOT PASSWORD ====================
  async forgotPass(dto: ForgotPassDto, lang: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new NotFoundException('common.USER_NOT_FOUND');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);

    try {
      await this.prisma.user.update({
        where: { email: dto.email },
        data: { otp, otpExpiresAt: expiresAt },
      });

      await this.mail.sendOtpMail(dto.email, otp);
    } catch (error) {
      console.error('Forgot Password Technical Error:', error);
      throw new InternalServerErrorException('auth.OTP_SEND_FAILED');
    }

    return this.responseHelper.success(null, 'auth.OTP', lang);
  }

  // ==================== CHECK OTP ====================
  async checkOtp(dto: CheckOtp, lang: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new NotFoundException('common.USER_NOT_FOUND');
    if (user.otp !== dto.otp.toString())
      throw new UnprocessableEntityException('auth.INVALID_OTP');
    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new BadRequestException('auth.OTP_EXPIRED');
    }

    return this.responseHelper.success(null, 'auth.OTP_VALID', lang);
  }

  // ==================== RESET PASSWORD ====================
  async resetPass(dto: ResetPassDto, lang: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new NotFoundException('common.USER_NOT_FOUND');
    if (user.otp !== dto.otp.toString())
      throw new BadRequestException('auth.INVALID_OTP');

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new BadRequestException('auth.OTP_EXPIRED');
    }

    try {
      const newHashedPassword = await argon.hash(dto.newPassword);

      await this.prisma.user.update({
        where: { email: dto.email },
        data: {
          password_hash: newHashedPassword,
          otp: null,
          otpExpiresAt: null,
        },
      });
    } catch (error) {
      console.error('Reset Password Technical Error:', error);
      throw new InternalServerErrorException('auth.PASSWORD_RESET_FAILED');
    }

    return this.responseHelper.success(null, 'auth.PASSWORD_RESET', lang);
  }

  // ==================== CHANGE PASSWORD ====================
  async changePass(userId: number, dto: ChangePassDto, lang: string) {

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { password_hash: true },
    });

    if (!user) throw new NotFoundException('common.USER_NOT_FOUND');

    if (dto.old_password === dto.new_password) {
      throw new UnprocessableEntityException({
        status: 'error',
        message: ['Validation failed.'],
        data: null,
        errors: {
          new_password: [this.i18n.translate('auth.SAME_PASSWORD')],
        }
      });
    }

    try {
      const pwMatches = await argon.verify(user.password_hash, dto.old_password);
      if (!pwMatches) {
        throw new UnprocessableEntityException({
          status: 'error',
          message: ['Validation failed.'],
          data: null,
          errors: {
            old_password: [this.i18n.translate('auth.INVALID_OLD_PASSWORD')]
          },
        });
      }
      const newHashedPassword = await argon.hash(dto.new_password);

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          password_hash: newHashedPassword,
        },
      });
      return this.responseHelper.success(null, 'auth.PASSWORD_CHANGED', lang);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('auth.PASSWORD_CHANGE_FAILED');
    }
  }

  // ==================== CHANGE EMAIL ====================
  private async sendEmailChangeVerificationLink(userId: number, newEmail: string, lang: string) {
    const verificationToken = await this.jwt.signAsync(
      {
        user_id: userId,
        new_email: newEmail,
        purpose: 'email_change',
      },
      {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: '1h',
      },
    );

    const serverUrl = this.config.get('SERVER_URL') ?? 'http://localhost:3000';
    const verifyLink = `${serverUrl}/api/verify-email-change?token=${verificationToken}`;

    await this.mail.sendActivationMail(newEmail, verifyLink);
  }

  private async validateEmailChangeRequest(userId: number, newEmail: string) {
    const trimmedEmail = newEmail.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.email.toLowerCase() === trimmedEmail) {
      throw new UnprocessableEntityException({
        status: 'error',
        message: ['Validation failed.'],
        data: null,
        errors: {
          new_email: ['New email must be different from current email'],
        },
      });
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: trimmedEmail },
      select: { id: true },
    });

    if (existingUser && existingUser.id !== userId) {
      throw new UnprocessableEntityException({
        status: 'error',
        message: ['Validation failed.'],
        data: null,
        errors: {
          new_email: ['Email already in use'],
        },
      });
    }

    return trimmedEmail;
  }

  async requestChangeOwnEmail(userId: number, newEmail: string, lang: string) {
    const normalizedEmail = await this.validateEmailChangeRequest(userId, newEmail);
    await this.sendEmailChangeVerificationLink(userId, normalizedEmail, lang);

    return this.responseHelper.success(
      null,
      'auth.EMAIL_CHANGE_VERIFICATION_SENT',
      lang,
    );
  }

  async requestChangeEmailForUser(requesterRole: string, userId: number, newEmail: string, lang: string) {
    const allowedRoles = ['admin'];
    const normalizedRole = String(requesterRole ?? '').toLowerCase();

    if (!allowedRoles.includes(normalizedRole)) {
      throw new ForbiddenException('User does not have permission to change another user email');
    }

    const normalizedEmail = await this.validateEmailChangeRequest(userId, newEmail);
    await this.sendEmailChangeVerificationLink(userId, normalizedEmail, lang);

    return this.responseHelper.success(
      null,
      'auth.EMAIL_CHANGE_VERIFICATION_SENT',
      lang,
    );
  }

  async verifyEmailChange(token: string): Promise<{
    status: 'success' | 'invalid' | 'expired' | 'user_not_found' | 'email_taken';
    email?: string;
  }> {
    let payload: any;
    let emailFromPayload: string | null = null;

    try {
      payload = this.jwt.verify(token, {
        secret: this.config.get('JWT_SECRET'),
      });
      emailFromPayload = payload?.new_email || null;
    } catch (error: any) {
      if (error?.name === 'TokenExpiredError') {
        try {
          const decoded = this.jwt.decode(token);
          emailFromPayload = decoded?.new_email || null;
        } catch {
          emailFromPayload = null;
        }
        return { status: 'expired', email: emailFromPayload || undefined };
      }
      return { status: 'invalid' };
    }

    const userId = Number(payload?.user_id);
    const newEmail = String(payload?.new_email ?? '').trim().toLowerCase();

    if (!userId || !newEmail) {
      return { status: 'invalid' };
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return { status: 'user_not_found', email: newEmail };
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: newEmail },
      select: { id: true },
    });

    if (existingUser && existingUser.id !== userId) {
      return { status: 'email_taken', email: newEmail };
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { email: newEmail },
    });

    return { status: 'success', email: newEmail };
  }

  // ==================== SIGN TOKEN ====================
  private async signToken(
    userId: number,
    email: string | null,
    role: string,
    university: string | null,
    permissions: string[],
  ): Promise<{ access_token: string }> {
    const payload = { sub: userId, email, role, university, permissions };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1500m',
      secret: this.config.get('JWT_SECRET'),
    });

    return { access_token: token };
  }
}
