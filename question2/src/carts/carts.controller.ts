import { Controller } from '@nestjs/common';
import { CartService } from './carts.service';

@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}
}
