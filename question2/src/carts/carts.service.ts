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
      if (this.itemExists(cart, item))
        throw new BadRequestException('Item already exists in cart');

      let lastItemId = cart.items.length > 0 ? cart.items.at(-1).id : 0;
      item.id = ++lastItemId;

      item.price = this.transformPrice(item.price);
      const totalPrice = this.transformPrice(item.price * item.quantity);
      item.totalPrice = totalPrice;

      cart.totalAmount = this.transformPrice(cart.totalAmount + totalPrice);

      cart.items.unshift(this.orderItem(item));
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
        cart.totalAmount -= cart.items[itemIndex].totalPrice; // subtract old price
        cart.items[itemIndex].totalPrice = this.transformPrice(
          cart.items[itemIndex].price * quantity,
        ); // update total price
        cart.totalAmount += cart.items[itemIndex].totalPrice; // add new price
        return {
          message: 'item successfully updated',
          Item: cart.items[itemIndex],
        };
      }
      throw new NotFoundException(`Item with id '${itemId}' not found`);
    }

    throw new NotFoundException('Cart not found');
  }

  deleteItem(cartId: string, itemId: number): CartResponse {
    const cart = this.carts.find((cart) => cart.id === cartId);
    if (cart && cart.items.length > 0) {
      const itemIndex = this.findIndex(cart, itemId);
      if (itemIndex !== -1) {
        cart.totalAmount = this.transformPrice(
          cart.totalAmount - cart.items[itemIndex].totalPrice,
        );
        cart.items.splice(itemIndex, 1);
        cart.numberOfItems = cart.items.length;
        return {
          message: `Item with id '${itemId}' successfully deleted`,
          cart,
        };
      }
      throw new NotFoundException(`Item with id '${itemId}' not found`);
    }
    if (cart) {
      throw new NotFoundException('Cart is empty');
    }

    throw new NotFoundException('Cart not found');
  }

  private findIndex(cart: Cart, itemId: number): number {
    return cart.items.findIndex((item) => +item.id === +itemId);
  }

  itemExists(cart: Cart, newItem: Item): boolean {
    return cart.items.some((item) => {
      return this.areItemsEqual(item, newItem);
    });
  }

  private areItemsEqual(item1: Item, item2: Item): boolean {
    const item1Keys = Object.keys(item1).filter(
      (key) => key !== 'id' && key !== 'totalPrice',
    );
    const item2Keys = Object.keys(item2).filter(
      (key) => key !== 'id' && key !== 'totalPrice',
    );

    if (item1Keys.length !== item2Keys.length) return false;

    for (const key of item1Keys) {
      if (item1[key] !== item2[key]) return false;
    }

    return true;
  }

  private orderItem(item: Item): Item {
    const result = {
      id: 0,
      name: '',
      price: 0,
      quantity: 0,
      totalPrice: 0,
    };

    for (const key of Object.keys(result)) {
      if (item.hasOwnProperty(key)) {
        result[key] = item[key];
      }
    }
    return result;
  }

  private transformPrice(amount: number): number {
    return Math.round(amount * 100) / 100;
  }
}
