import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { CreateUserManagementDto } from './dto/create-user-management.dto';
import { UpdateStudentInfoDto } from './dto/update-student-info.dto';
import { UpdateNonStudentInfoDto } from './dto/update-non-student-info.dto';
import { I18nLang, I18nService } from 'nestjs-i18n';
import { JwtGuard } from 'src/modules/auth/guard';
import { Roles, RolesGuard } from 'src/modules/auth/roles';
import { ResponseHelper } from 'src/response-helper/response-helper';
import { GetUser } from 'src/modules/auth/decorator';
import {
  ALL_PERMISSIONS,
  PERMISSIONS,
  PermissionsGuard,
  RequirePermissions,
} from 'src/modules/auth/permissions';
import { GrantUserPermissionsDto } from './dto/grant-user-permissions.dto';

@Roles('admin')
@UseGuards(JwtGuard, RolesGuard, PermissionsGuard)
@Controller('api/users')
export class UserManagementController {
  constructor(
    private readonly userManagementService: UserManagementService,
    private readonly responseHelper: ResponseHelper,
    private readonly i18n: I18nService,
  ) { }

  @HttpCode(200)
  @Post()
  create(
    @Body() createUserManagementDto: CreateUserManagementDto,
    @I18nLang() lang: string,
  ) {
    return this.userManagementService.createUser(createUserManagementDto, lang);
  }

  @HttpCode(200)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @I18nLang() lang: string,
  ) {
    return this.userManagementService.deleteUser(id, lang);
  }

  @HttpCode(200)
  @Patch('toggle-block/:id')
  toggleBlock(
    @Param('id', ParseIntPipe) id: number,
    @I18nLang() lang: string,
  ) {
    return this.userManagementService.toggleUserBlock(id, lang);
  }

  @HttpCode(200)
  @Put(':id/student-info')
  updateStudentInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStudentInfoDto: UpdateStudentInfoDto,
    @I18nLang() lang: string,
  ) {
    return this.userManagementService.updateStudentInfo(id, updateStudentInfoDto, lang);
  }

  @HttpCode(200)
  @Put(':id/info')
  updateNonStudentInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNonStudentInfoDto: UpdateNonStudentInfoDto,
    @I18nLang() lang: string,
  ) {
    return this.userManagementService.updateNonStudentInfo(id, updateNonStudentInfoDto, lang);
  }

  @HttpCode(200)
  @Get(':id')
  getById(
    @Param('id', ParseIntPipe) id: number,
    @I18nLang() lang: string,
  ) {
    return this.userManagementService.getUserById(id, lang);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @I18nLang() lang: string,
    @GetUser('sub') userId: number,
    @Query('role') role?: string,
    @Query('is_active') isActive?: string,
    @Query('page') page = 1,
    @Query('page_size') pageSize = 20,
    @Query('with_pagination') withPagination?: string,
  ) {
    // parse isActive query param to boolean
    let parsedIsActive: boolean | undefined = undefined;
    if (isActive === 'true') parsedIsActive = true;
    else if (isActive === 'false') parsedIsActive = false;

    const safePage = Math.max(+page, 1);
    const safePageSize = Math.min(Math.max(+pageSize, 1), 50);
    const usePagination = withPagination?.toLowerCase() !== 'false';

    const result = await this.userManagementService.findAllUsers(lang, userId, {
      role,
      isActive: parsedIsActive,
      page: safePage,
      pageSize: safePageSize,
      withPagination: usePagination,
    });

    return this.responseHelper.success(
      result.data,
      'common.USERS_FETCHED_SUCCESS',
      lang,
      result.meta,
    );
  }

  @HttpCode(200)
  @Get('permissions/:id')
  getPermissions(@Param('id', ParseIntPipe) id: number , @I18nLang() lang: string) {
    return this.userManagementService.getUserPermissions(id, lang);
  }

  @HttpCode(200)
  @Post('permissions/grant/:id')
  grantPermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: GrantUserPermissionsDto,
    @I18nLang() lang: string,
  ) {
    if (!dto || !Array.isArray(dto.permissions)) {
      throw new BadRequestException(this.i18n.translate('common.PERMISSIONS_REQUIRED'));
    }
    
    return this.userManagementService.grantPermissions(id, dto.permissions, lang);
  }
}
