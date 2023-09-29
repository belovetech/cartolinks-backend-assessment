import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './carts.controller';
import { CartService } from './carts.service';
import { CreateItemDto } from './dtos/create-item.dto';

describe('CartController', () => {
  let controller: CartController;
  let service: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [CartService],
    }).compile();

    controller = module.get<CartController>(CartController);
    service = module.get<CartService>(CartService);
  });

  describe('createCart', () => {
    it('should create a new cart', () => {
      const result = {
        message: 'Cart created successfully',
        cart: {
          id: '01HBGW8G90GRWF61744GSDFABP',
          numberOfItems: 0,
          items: [],
          totalAmount: 0,
        },
      };

      jest.spyOn(service, 'create').mockImplementation(() => result);

      expect(controller.createCart()).toBe(result);
    });
  });

  describe('addItem', () => {
    it('should add an item to a cart', () => {
      const cartId = '1';
      const item: CreateItemDto = {
        name: 'item 1',
        price: 10.2,
        quantity: 2,
      };
      const result = {
        message: 'Item successfully added',
        cart: {
          id: '01HBGW8G90GRWF61744GSDFABP',
          numberOfItems: 1,
          items: [
            {
              name: 'item 1',
              price: 10.2,
              quantity: 2,
              id: 1,
              totalPrice: 10.4,
            },
          ],
          totalAmount: 10.4,
        },
      };
      jest.spyOn(service, 'addItem').mockImplementation(() => result);

      expect(controller.addItem(cartId, item)).toBe(result);
    });

    it('should return an error message if cart is not found', () => {
      const cartId = '1';
      const item: CreateItemDto = {
        name: 'item 1',
        price: 10.2,
        quantity: 1,
      };
      jest.spyOn(service, 'addItem').mockImplementation(() => null);

      expect(controller.addItem(cartId, item)).toEqual({
        message: 'Cart not found',
      });
    });
  });

  describe('deleteItem', () => {
    it('should delete an item from a cart', () => {
      const cartId = '1';
      const itemId = 1;
      const result = {
        message: "Item with id '2' successfully deleted",
        cart: {
          id: '01HBGW8G90GRWF61744GSDFABP',
          numberOfItems: 2,
          items: [
            {
              name: 'Item 1',
              price: 5.2,
              quantity: 2,
              id: 1,
              totalPrice: 10.4,
            },
            {
              name: 'Item 2',
              price: 10.5,
              quantity: 1,
              id: 3,
              totalPrice: 10.5,
            },
          ],
          totalAmount: 20.9,
        },
      };

      jest.spyOn(service, 'deleteItem').mockImplementation(() => result);

      expect(controller.deleteItem(cartId, itemId)).toBe(result);
    });
  });

  describe('updateItem', () => {
    it('should update an item in a cart', async () => {
      const cartId = '1';
      const itemId = 1;
      const item: Partial<CreateItemDto> = {
        quantity: 2,
      };
      const result = {
        message: 'item successfully updated',
        Item: {
          name: 'Item 1',
          price: 10.2,
          quantity: 2,
          id: 1,
          totalPrice: 20.4,
        },
      };
      jest.spyOn(service, 'updateItem').mockImplementation(() => result);
      const response = await controller.updateItem(cartId, itemId, item);
      expect(response).toBe(result);
    });
  });
});
