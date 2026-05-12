import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  ConflictException,
  UnprocessableEntityException
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ValidationError } from 'class-validator';
import { ResponseHelper } from '../response-helper/response-helper';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  i18n: any;
  constructor(private readonly responseHelper: ResponseHelper) { }

  private mapValidationErrors(errors: ValidationError[]) {
    const result: Record<string, string[]> = {};
    for (const err of errors) {
      if (err.constraints) {
        result[err.property] = Object.values(err.constraints);
      } else if (err.children && err.children.length) {
        result[err.property] = this.flattenChildren(err.children);
      }
    }
    return result;
  }

  private flattenChildren(children: ValidationError[]): string[] {
    const msgs: string[] = [];
    for (const child of children) {
      if (child.constraints) {
        msgs.push(...Object.values(child.constraints));
      }
      if (child.children && child.children.length) {
        msgs.push(...this.flattenChildren(child.children));
      }
    }
    return msgs;
  }

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const lang =
      (
        request.headers['lang'] ||
        request.headers['Lang'] ||
        request.headers['accept-language'] ||
        request.headers['Accept-Language']
      )?.toString() || 'en';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let res: any;

    if (exception instanceof HttpException) {
      const excRes = exception.getResponse();
      status = exception.getStatus();

      let messageKey: string = 'common.ERROR';

      if (typeof excRes === 'string') {
        messageKey = excRes;
      } else if (excRes && typeof excRes === 'object') {
        if ((excRes as any).message) {
          messageKey = Array.isArray((excRes as any).message)
            ? (excRes as any).message[0]
            : (excRes as any).message;
        }
      }

      if (exception instanceof ConflictException) {
        res = await this.responseHelper.error(messageKey, lang, status);
      }
      else if (exception instanceof UnprocessableEntityException) {

        if ((excRes as any)?.errors) {
          res = await this.responseHelper.error(
            'common.VALIDATION_FAILED',
            lang,
            status,
            (excRes as any).errors,
          );
        }

        else {
          const msg =
            typeof excRes === 'string'
              ? excRes
              : (excRes as any)?.message;

          res = await this.responseHelper.error(msg, lang, status);
        }
      }

      else if (Array.isArray(excRes)) {
        const mappedErrors = this.mapValidationErrors(
          excRes as ValidationError[],
        );
        res = await this.responseHelper.error(
          'common.VALIDATION_FAILED',
          lang,
          status,
          mappedErrors,
        );
      }
      else if ((excRes as any)?.errors) {
        res = await this.responseHelper.error(
          'common.VALIDATION_FAILED',
          lang,
          status,
          (excRes as any).errors,
        );
      }
      else {
        res = await this.responseHelper.error(messageKey, lang, status);
      }
    } else {
      res = await this.responseHelper.error('common.ERROR', lang, status);
    }

    response.status(status).send(res);
  }
}
