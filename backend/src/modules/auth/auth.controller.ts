import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Redirect,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import {
  ChangePassDto,
  ChangeEmailDto,
  CheckOtp,
  ForgotPassDto,
  ResendAvtivationAccountDto,
  ResetPassDto,
  SigninDto,
  SignupDto,
} from './dto';
import { I18nLang, I18nService } from 'nestjs-i18n';
import { GetUser } from './decorator';
import { JwtGuard } from './guard';

@Controller('api')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly i18n: I18nService,
    private config: ConfigService,
  ) { }

  @Post('signup')
  async signup(@Body() dto: SignupDto, @I18nLang() lang: string) {
    return this.auth.signup(dto, lang);
  }

  @HttpCode(200)
  @Post('resend-activation')
  async resendActivation(
    @Body() dto: ResendAvtivationAccountDto,
    @I18nLang() lang: string,
  ) {
    return this.auth.resendActivation(dto, lang);
  }

  @Get('activate')
  @Redirect()
  async activateAccount(@Query('token') token: string) {
    const result = await this.auth.activateAccount(token);

    const baseUrl = this.config.get('FRONT_URL');
    let redirectUrl = baseUrl + '/auth';

    switch (result.status) {
      case 'success':
        redirectUrl += `?activated=success&email=${encodeURIComponent(result.email!)}`;
        break;
      case 'already_active':
        redirectUrl += `?activated=already&email=${encodeURIComponent(result.email!)}`;
        break;
      case 'expired':
        redirectUrl += `?activated=expired&email=${encodeURIComponent(result.email || '')}`;
        break;
      case 'invalid':
      default:
        redirectUrl += `?activated=invalid`;
        break;
    }

    return { url: redirectUrl };
  }

  @Post('signin')
  @HttpCode(200)
  async signin(@Body() dto: SigninDto, @I18nLang() lang: string) {
    return await this.auth.signin(dto, lang);
  }

  @HttpCode(200)
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPassDto, @I18nLang() lang: string) {
    return await this.auth.forgotPass(dto, lang);
  }

  @HttpCode(200)
  @Post('check-otp')
  async checkOtp(@Body() dto: CheckOtp, @I18nLang() lang: string) {
    return await this.auth.checkOtp(dto, lang);
  }

  @HttpCode(200)
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPassDto, @I18nLang() lang: string) {
    return await this.auth.resetPass(dto, lang);
  }

  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Post('change-password')
  async changePassword(
    @GetUser('sub') userId: number,
    @Body() dto: ChangePassDto,
    @I18nLang() lang: string,
  ) {
    return await this.auth.changePass(userId, dto, lang);
  }

  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Post('change-email')
  async changeOwnEmail(
    @GetUser('sub') userId: number,
    @Body() dto: ChangeEmailDto,
    @I18nLang() lang: string,
  ) {
    return await this.auth.requestChangeOwnEmail(userId, dto.new_email, lang);
  }

  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Post('change-email/:id')
  async changeEmailForAnotherUser(
    @GetUser('role') requesterRole: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangeEmailDto,
    @I18nLang() lang: string,
  ) {
    if (!dto?.new_email) {
      throw new BadRequestException('new_email is required');
    }

    return await this.auth.requestChangeEmailForUser(requesterRole, id, dto.new_email, lang);
  }

  @HttpCode(200)
  @Get('verify-email-change')
  @Redirect()
  async verifyEmailChange(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('token is required');
    }

    const result = await this.auth.verifyEmailChange(token);
    const baseUrl = this.config.get('FRONT_URL');
    let redirectUrl = baseUrl;

    switch (result.status) {
      case 'success':
        redirectUrl += `?email_change=success&email=${encodeURIComponent(result.email || '')}`;
        break;
      case 'expired':
        redirectUrl += `?email_change=expired&email=${encodeURIComponent(result.email || '')}`;
        break;
      case 'email_taken':
        redirectUrl += `?email_change=taken&email=${encodeURIComponent(result.email || '')}`;
        break;
      case 'user_not_found':
        redirectUrl += `?email_change=user_not_found`;
        break;
      case 'invalid':
      default:
        redirectUrl += `?email_change=invalid`;
        break;
    }

    return { url: redirectUrl };
  }

}
