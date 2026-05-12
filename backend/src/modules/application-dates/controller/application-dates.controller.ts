import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApplicationDatesService } from '../application-dates.service';
import { I18nLang } from 'nestjs-i18n';


@Controller('api/application-dates')
export class ApplicationDatesController {
  constructor(
    private readonly service: ApplicationDatesService,
  ) { }
  @Get('')
  findStudentApplicationDates(
    @I18nLang() lang: string,
  ) {
    return this.service.findStudentApplicationDates(lang);
  }

  @Get('period/status')
  getStatus(
    @I18nLang() lang: string
  ) {
    return this.service.getStatus(lang);
  }

  @Get('current-period')
  getCurrentOpenedPeriod(
    @I18nLang() lang: string,
  ) {
    return this.service.getCurrentOpenedPeriod(lang);
  }
}


