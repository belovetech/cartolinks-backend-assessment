import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthcheckService {
  health(): Record<string, string> {
    return { message: 'Pong!' };
  }
}
