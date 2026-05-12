import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/modules/auth/decorator';
import { UserService } from './user.service';
import { JwtGuard } from '../auth/guard';
import { I18nLang } from 'nestjs-i18n';

@UseGuards(JwtGuard)
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('me')
  getMe(@GetUser('sub') userId: number, @GetUser('lang') lang: string) {
    return this.userService.getUserById(userId, lang);
  }

  @UseGuards(JwtGuard)
  @Get('my-email')
  async getOwnEmail(@GetUser('sub') userId: number, @I18nLang() lang: string) {
    return await this.userService.returnUserEmail(userId, lang);
  }
}
