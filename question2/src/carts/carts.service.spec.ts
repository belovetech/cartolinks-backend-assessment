import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './carts.service';
import { NotFoundException } from '@nestjs/common';

describe('CartService', () => {
  let service: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartService],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  describe('create', () => {
    it('should create a new cart', () => {
      const result = service.create();
      expect(result.message).toEqual('Cart created successfully');
      expect(result.cart.id).toBeDefined();
      expect(result.cart.numberOfItems).toEqual(0);
      expect(result.cart.items).toEqual([]);
      expect(result.cart.totalAmount).toEqual(0);
    });
  });

  describe('addItem', () => {
    it('should add an item to an existing cart', () => {
      const cart = service.create().cart;
      const item = {
        name: 'Test Item',
        price: 10.0,
        quantity: 2,
      };
      const result = service.addItem(cart.id, item);
      expect(result.message).toEqual('Item successfully added');
      expect(result.cart.numberOfItems).toEqual(1);
      expect(result.cart.items[0]).toEqual({
        id: 1,
        name: 'Test Item',
        price: 10.0,
        quantity: 2,
        totalPrice: 20.0,
      });
      expect(result.cart.totalAmount).toEqual(20.0);
    });

    it('should throw a NotFoundException if the cart does not exist', () => {
      expect(() => {
        service.addItem('invalid-cart-id', {
          name: 'Test Item',
          price: 10.0,
          quantity: 2,
        });
      }).toThrowError(NotFoundException);
    });
  });

  describe('deleteItem', () => {
    it('should delete an item from an existing cart', () => {
      const cart = service.create().cart;
      const item = {
        name: 'Test Item',
        price: 10.0,
        quantity: 2,
      };
      const result = service.addItem(cart.id, item);
      const itemId = result.cart.items[0].id;
      const deleteResult = service.deleteItem(cart.id, itemId);
      expect(deleteResult.message).toEqual(
        `Item with id '${itemId}' successfully deleted`,
      );
      expect(deleteResult.cart.numberOfItems).toEqual(0);
      expect(deleteResult.cart.items).toEqual([]);
      expect(deleteResult.cart.totalAmount).toEqual(0);
    });

    it('should throw a NotFoundException if the cart does not exist', () => {
      expect(() => {
        service.deleteItem('invalid-cart-id', 1);
      }).toThrowError(NotFoundException);
    });

    it('should throw a NotFoundException if the item does not exist', () => {
      const cart = service.create().cart;
      expect(() => {
        service.deleteItem(cart.id, 1);
      }).toThrowError(NotFoundException);
    });

    it('should throw a NotFoundException if the cart is empty', () => {
      const cart = service.create().cart;
      expect(() => {
        service.deleteItem(cart.id, 1);
      }).toThrowError(NotFoundException);
    });
  });

  describe('updateItem', () => {
    it('should update an item in an existing cart', () => {
      const cart = service.create().cart;
      const item = {
        name: 'Test Item',
        price: 10.0,
        quantity: 2,
      };
      const result = service.addItem(cart.id, item);
      const itemId = result.cart.items[0].id;
      const updateResult = service.updateItem(cart.id, itemId, 3);
      expect(updateResult.message).toEqual('item successfully updated');
      expect(updateResult.Item).toEqual({
        id: itemId,
        name: 'Test Item',
        price: 10.0,
        quantity: 3,
        totalPrice: 30.0,
      });
      expect(updateResult.Item.totalPrice).toEqual(30.0);
      expect(updateResult.Item.quantity).toEqual(3);
      expect(updateResult.Item.price).toEqual(10.0);
    });

    it('should throw a NotFoundException if the cart does not exist', () => {
      expect(() => {
        service.updateItem('invalid-cart-id', 1, 3);
      }).toThrowError(NotFoundException);
    });

    it('should throw a NotFoundException if the item does not exist', () => {
      const cart = service.create().cart;
      expect(() => {
        service.updateItem(cart.id, 1, 3);
      }).toThrowError(NotFoundException);
    });
  });
});
