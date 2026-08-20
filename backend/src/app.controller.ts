import { Controller, Get, Redirect } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Redirect('/api/v1/health', 301)
  root() {
    // Redirect root to health check by default
  }
}
