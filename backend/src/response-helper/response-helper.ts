import { Global, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import {
  ApiResponse,
  ApiMeta,
} from './api-response';

@Global()
@Injectable()
export class ResponseHelper {
  constructor(private readonly i18n: I18nService) {}

 async success<T>(
  data: T,
  messageKey: string,
  lang: string,
  meta: ApiMeta | null = null,
): Promise<ApiResponse<T>> {
  const translated = await this.i18n.translate(messageKey, { lang });

  return {
    status: 'success',
    message: [translated as string],
    data: data === undefined ? null : data,
    meta,
    errors: null,
  };
}

  async error(
    messageKey: string,
    lang: string,
    statusCode = 400,
    errors: any = null,
  ): Promise<any> {
    const key = typeof messageKey === 'string' ? messageKey : 'common.ERROR';
    const translated = await this.i18n.translate(key, { lang });

    return {
      status: 'error',
      message: [translated as string],
      data: null,
      errors,
    };
  }
}
