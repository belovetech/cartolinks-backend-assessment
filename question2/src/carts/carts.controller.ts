import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CartService } from './carts.service';
import { CreateItemDto } from './dtos/create-item.dto';
import { CartResponse } from './interfaces/cart.interface';
import { ApiBody } from '@nestjs/swagger';

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

  /**
   * Endpoint to delete an item from a cart
   * @param {string} cartId - The ID of the cart to delete the item from
   * @param {number} itemId - The ID of the item to delete
   * @returns {CartResponse | { message: string }}
   */
  @Delete(':cartId/:itemId')
  deleteItem(@Param('cartId') cartId: string, @Param('itemId') itemId: number) {
    return this.cartService.deleteItem(cartId, itemId);
  }

  /**
   * Endpoint to update the quantity of an item in a cart
   * @param {string} cartId - The ID of the cart containing the item to update
   * @param {number} itemId - The ID of the item to update
   * @param {number} quantity - The new quantity of the item
   * @returns {CartResponse | { message: string }}
   */

  @ApiBody({ type: CreateItemDto })
  @Patch(':cartId/:itemId')
  async updateItem(
    @Param('cartId') cartId: string,
    @Param('itemId') itemId: number,
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        skipMissingProperties: true,
      }),
    )
    cart: Partial<CreateItemDto>,
  ) {
    return this.cartService.updateItem(cartId, itemId, cart.quantity);
  }
}
