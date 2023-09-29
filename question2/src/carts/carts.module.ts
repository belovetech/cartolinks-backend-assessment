import { Module } from '@nestjs/common';
import { CartService } from './carts.service';

@Module({
  controllers: [CartController],
  providers: [CartService],
})
export class CartsModule {}
