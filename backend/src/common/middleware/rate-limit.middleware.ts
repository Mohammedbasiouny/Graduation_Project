import { Injectable, NestMiddleware } from '@nestjs/common';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { I18nService } from 'nestjs-i18n';

const rateLimiter = new RateLimiterMemory({
  points: 5,
  duration: 60,
});

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  constructor(private readonly i18n: I18nService) {}

  async use(req: any, res: any, next: () => void) {
    try {
      await rateLimiter.consume(req.ip);
      next();
    } catch (err) {
      const lang =
        req.headers['accept-language']?.split(',')[0] || req.query.lang || 'en';

      const message = await this.i18n.translate('common.tooManyRequests', {
        lang,
      });

      return res.status(429).json({
        status: 'error',
        message: [message],
        data: null,
        errors: null,
      });
    }
  }
}
