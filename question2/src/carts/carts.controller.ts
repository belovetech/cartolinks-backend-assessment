import { Body, Controller, Param, Post } from '@nestjs/common';
import { CartService } from './carts.service';
import { CreateItemDto } from './dtos/create-item.dto';
import { CartResponse } from './interfaces/cart.interface';

@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /**
   * Endpoint to create a new cart
   * @returns {CartResponse} The newly created cart
   */
  @Post()
  createCart(): CartResponse {
    return this.cartService.create();
  }

  /**
   * Endpoint to add an item to a cart
   * @param {string} cartId - The ID of the cart to add the item to
   * @param {CreateItemDto} item - The item to add to the cart
   * @returns {CartResponse | { message: string }} The newly added item or an error message if the cart is not found
   */
  @Post(':cartId')
  addItem(@Param('cartId') cartId: string, @Body() item: CreateItemDto) {
    const response = this.cartService.addItem(cartId, item);
    if (response) {
      return response;
    }
    return { message: 'Cart not found' };
  }
}
