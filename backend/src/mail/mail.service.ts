import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendOtpMail(to: string, otp: string) {
    await this.mailerService.sendMail({
      to,
      subject: 'Your OTP Code',
      template: 'otp',
      context: { otp },
    });
  }

  async sendWelcomeMail(to: string, name: string) {
    await this.mailerService.sendMail({
      to,
      subject: 'Welcome!',
      template: 'welcome',
      context: { name },
    });
  }

  async sendCustomMail(dto: SendMailDto) {
    await this.mailerService.sendMail({
      to: dto.to,
      subject: dto.subject,
      template: dto.template,
      context: dto.context,
    });
  }

  async sendActivationMail(to: string, activationLink: string) {
    await this.mailerService.sendMail({
      to,
      subject: 'Activate Your Account',
      template: 'activate',
      context: { activationLink },
    });
  }
}
