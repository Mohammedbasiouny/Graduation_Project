import { BadRequestException, MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { I18nModule, QueryResolver, HeaderResolver } from 'nestjs-i18n';
import * as path from 'path';
import { UserModule } from './modules/user/user.module';
import { MailModule } from './mail/mail.module';
import { ResponseHelperModule } from './response-helper/response-helper.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { RateLimitMiddleware } from './common/middleware/rate-limit.middleware';
import { PreUniversityQualificationsModule } from './modules/pre-university-qualifications/pre-university-qualifications.module';
import { LocationsModule } from './modules/locations/locations.module';
import { ApplicationDatesModule } from './modules/application-dates/application-dates.module';
import { StudentModule } from './modules/student/student.module';
import { ApplicationDatesStudentController } from './modules/application-dates/controller/application-dates.student.controller';
import { AcademicsModule } from './modules/academics/academics.module';
import { DormitoryModule } from './modules/dormitory/dormitory.module';
import { AdminModule } from './modules/admin/admin.module';
import { RestaurantModule } from './modules/restaurant/restaurant.module';
import { AcceptanceModule } from './modules/admin/acceptance/acceptance.module';
import { SettingsModule } from './modules/settings/settings.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ViewFileModule } from './modules/file/file.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TmpUploadsCleanupService } from './common/delete-tmp-uploads/tmp-uploads-cleanup.service';
import { AuditLogsModule } from './common/audit-logs/audit-logs.module';
import { AuditLogsInterceptor } from './common/audit-logs/audit-logs.interceptor';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { ResidentsModule } from './modules/residents/residents.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ScheduleModule.forRoot(),

    // ✅ serve uploads folder publicly
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),

    // ✅ multer upload config
    MulterModule.register({
      storage: diskStorage({
        destination: path.join(process.cwd(), 'uploads', 'tmp'),
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),

      fileFilter: (req, file, cb) => {
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
        const allowedMimeTypes = [
          'image/jpeg',
          'image/png',
          'application/pdf',
        ];

        const ext = path.extname(file.originalname).toLowerCase();

        const isValidExt = allowedExtensions.includes(ext);
        const isValidMime = allowedMimeTypes.includes(file.mimetype);

        if (!isValidExt || !isValidMime) {
          return cb(
            new BadRequestException('File type not allowed'),
            false,
          );
        }

        cb(null, true);
      },
    }),

    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(process.cwd(), 'src/i18n'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        new HeaderResolver(['accept-language']),
      ],
    }),

    PrismaModule,
    AuthModule,
    UserModule,
    MailModule,
    ResponseHelperModule,
    PreUniversityQualificationsModule,
    LocationsModule,
    ApplicationDatesModule,
    StudentModule,
    AcademicsModule,
    DormitoryModule,
    AdminModule,
    RestaurantModule,
    AcceptanceModule,
    SettingsModule,
    ViewFileModule,
    AuditLogsModule,
    AttendanceModule,
    ResidentsModule,
    HealthModule,
  ],
  controllers: [ApplicationDatesStudentController],
  providers: [
    TmpUploadsCleanupService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogsInterceptor,
    },
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(RateLimitMiddleware).forRoutes('*');
  // }
}