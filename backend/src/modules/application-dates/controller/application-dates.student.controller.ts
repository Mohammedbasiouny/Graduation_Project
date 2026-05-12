import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApplicationDatesService } from '../application-dates.service';
import { I18nLang } from 'nestjs-i18n';
import { GetUser } from 'src/modules/auth/decorator';
import { JwtGuard } from 'src/modules/auth/guard';
import { Roles, RolesGuard } from 'src/modules/auth/roles';

@Roles('student')
@UseGuards(JwtGuard, RolesGuard)
@Controller('api/student/application-dates')
export class ApplicationDatesStudentController {
    constructor(
        private readonly service: ApplicationDatesService,
    ) { }

    @Get('')
    findStudentApplicationDates(
        @I18nLang() lang: string,
        @GetUser('sub') id: number,
    ) {
        return this.service.findStudentApplicationDates(lang, id);
    }

    @Get('current-period')
    getCurrentOpenedPeriod(
        @I18nLang() lang: string,
        @GetUser('sub') id: number,
    ) {
        return this.service.getCurrentOpenedPeriod(lang, id);
    }
}
