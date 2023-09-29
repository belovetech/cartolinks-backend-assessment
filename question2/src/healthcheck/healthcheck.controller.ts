import { Controller, Get } from '@nestjs/common';
import { HealthcheckService } from './healthcheck.service';

@Controller('healthcheck')
export class HealthcheckController {
  constructor(private readonly appService: HealthcheckService) {}

  @Get('ping')
  health(): Record<string, string> {
    return this.appService.health();
  }
}
