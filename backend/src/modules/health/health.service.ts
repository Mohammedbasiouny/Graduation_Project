import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

type ServiceState = 'up' | 'down';

interface ServiceCheckResult {
  name: string;
  status: ServiceState;
  url: string;
  response_time_ms: number | null;
  detail?: unknown;
  error?: string;
}

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  private async timedCheck(url: string, init?: RequestInit): Promise<ServiceCheckResult> {
    const startedAt = Date.now();

    try {
      const response = await fetch(url, {
        ...init,
        signal: AbortSignal.timeout(5000),
      });

      const responseTimeMs = Date.now() - startedAt;
      const contentType = response.headers.get('content-type') ?? '';
      const detail = contentType.includes('application/json')
        ? await response.json()
        : await response.text();

      return {
        name: url,
        status: response.ok ? 'up' : 'down',
        url,
        response_time_ms: responseTimeMs,
        detail,
      };
    } catch (error: any) {
      return {
        name: url,
        status: 'down',
        url,
        response_time_ms: null,
        error: error?.message ?? 'Health check failed',
      };
    }
  }

  async getServicesHealth(): Promise<Record<string, unknown>> {
    const idCardBaseUrl =
      this.config.get<string>('AI_SERVICE_PUBLIC_URL') ??
      this.config.get<string>('SERVICE_URL') ??
      'http://id-card-detection:8000';

    const attendanceBaseUrl =
      this.config.get<string>('PYTHON_SERVICE_URL') ??
      'http://udorm-attendance-service:8001';

    const [idCardDocs, attendanceStatus] = await Promise.all([
      this.timedCheck(`${idCardBaseUrl.replace(/\/+$/, '')}/docs`),
      this.timedCheck(`${attendanceBaseUrl.replace(/\/+$/, '')}/status`),
    ]);

    const settings = await this.prisma.settings.findFirst({
      select: {
        application_period_open: true,
        application_period_open_changed_at: true,
        updated_at: true,
      },
      orderBy: { id: 'asc' },
    });

    return {
      status: 'success',
      service: 'udorm-backend',
      timestamp: new Date().toISOString(),
      uptime_seconds: Math.round(process.uptime()),
      backend: {
        status: 'up',
      },
      application_period: settings
        ? {
            status: settings.application_period_open,
            updated_at: settings.application_period_open_changed_at,
          }
        : {
            status: false,
            updated_at: null,
          },
      services: {
        id_card_detection: idCardDocs,
        attendance: attendanceStatus,
      },
    };
  }
}