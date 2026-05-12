import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { I18nLang } from 'nestjs-i18n';
import { UpdateSettingsDto } from './dto';
import { SettingsService } from './settings.service';
import { Roles, RolesGuard } from '../auth/roles';
import { JwtGuard } from '../auth/guard';

@Roles('admin')
@UseGuards(JwtGuard, RolesGuard)
@Controller('api/admin/settings')
export class SettingsController {
	constructor(private readonly settingsService: SettingsService) {}


	@Get()
	getSettings(@I18nLang() lang: string) {
		return this.settingsService.getSettings(lang);
	}

	@Put()
	updateSettings(
		@Body() dto: UpdateSettingsDto,
		@I18nLang() lang: string,
	) {
		return this.settingsService.updateSettings(dto, lang);
	}
}
