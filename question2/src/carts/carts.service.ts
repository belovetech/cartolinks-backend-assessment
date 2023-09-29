import { ulid } from 'ulid';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Cart, Item, CartResponse } from './interfaces/cart.interface';

@Injectable()
export class CartService {
  private readonly carts: Cart[] = [];

  create() {
    const cart = {
      id: ulid(),
      numberOfItems: 0,
      items: [],
      totalAmount: 0.0,
    };
    this.carts.push(cart);
    return { message: 'Cart created successfully', cart };
  }

  addItem(cartId: string, item: Item): CartResponse {
    const cart = this.carts.find((cart) => cart.id === cartId);

    if (cart) {
      let lastItemId = cart.items.length > 0 ? cart.items.at(-1).id : 0;
      item.id = ++lastItemId;

      const totalPrice = item.price * item.quantity;
      item.totalPrice = totalPrice;

      cart.totalAmount += totalPrice;
      cart.items.push(item);
      cart.numberOfItems = cart.items.length;

      return { message: 'Item successfully added', cart };
    }

    throw new NotFoundException('Cart not found');
  }

  updateItem(cartId: string, itemId: number, quantity: number): CartResponse {
    if (quantity === undefined)
      throw new BadRequestException('Quantity is required');

    if (quantity < 1)
      throw new BadRequestException('Quantity must be greater than 0');

    const cart = this.carts.find((cart) => cart.id === cartId);
    if (cart) {
      const itemIndex = this.findIndex(cart, itemId);
      if (itemIndex !== -1) {
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].totalPrice =
          cart.items[itemIndex].price * quantity;
        return {
          message: 'item successfully updated',
          Item: cart.items[itemIndex],
        };
      }
      throw new NotFoundException(`Item with id '${itemId}' not found`);
    }

    throw new NotFoundException('Cart not found');
  }

  findIndex(cart: Cart, itemId: number): number {
    return cart.items.findIndex((item) => +item.id === +itemId);
  }
}
