import { Module } from '@nestjs/common';
import { CartsModule } from './carts/carts.module';
import { HealthcheckModule } from './healthcheck/healthcheck.module';

@Module({
  imports: [CartsModule, HealthcheckModule],
})
export class AppModule {}
