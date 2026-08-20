import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  check() {
    // In a real scenario, you might read this from package.json
    const version = process.env.npm_package_version || '1.0.0';

    return {
      status: 'ok',
      version,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: this.configService.get<string>('app.nodeEnv'),
    };
  }
}
