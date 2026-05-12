import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('api/health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  getBackendHealth(): Record<string, unknown> {
    return {
      status: 'success',
      service: 'udorm-backend',
      timestamp: new Date().toISOString(),
      uptime_seconds: Math.round(process.uptime()),
    };
  }

  @Get('services')
  getServicesHealth(): Promise<Record<string, unknown>> {
    return this.healthService.getServicesHealth();
  }
}