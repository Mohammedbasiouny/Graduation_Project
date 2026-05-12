// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ValidationPipe,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ResponseHelper } from './response-helper/response-helper';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import * as express from 'express';
import { join } from 'path';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });


  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));


  const responseHelper = app.get(ResponseHelper);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (validationErrors = []) => {
        const errors: Record<string, string[]> = {};
        for (const err of validationErrors) {
          if (err.constraints) {
            errors[err.property] = Object.values(err.constraints);
          }
        }
        return new UnprocessableEntityException({
          errors,
          status: 'error',
          message: ['Validation error'],
          data: null,
          statusCode: 422,
        });
      },
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter(responseHelper));

  app.enableCors({
    origin: process.env.FRONT_URL ?? 'http://localhost:3030',
    methods: 'GET,PUT,HEAD,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
}

bootstrap();
