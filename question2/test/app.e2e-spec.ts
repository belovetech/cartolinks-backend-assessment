import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('#Healthcheck', () => {
    it('/ (GET)', () => {
      return request(app.getHttpServer())
        .get('/healthcheck/ping')
        .expect(200)
        .expect({ message: 'Pong!' });
    });
  });

  describe('#carts', () => {
    describe('(POST) /carts', () => {
      it('should create a cart', async () => {
        const response = await createCart(app);
        expect(response.status).toBe(201);
        expect(response.body.message).toEqual('Cart created successfully');
        expect(response.body.cart.id).toBeDefined();
        expect(response.body.cart.numberOfItems).toEqual(0);
        expect(response.body.cart.items).toEqual([]);
        expect(response.body.cart.totalAmount).toEqual(0);
      });
    });

    describe('(POST) /carts/:cartId', () => {
      it('should add an item to a cart', async () => {
        const cart = await createCart(app);
        const cartId = cart.body.cart.id;
        const response = await request(app.getHttpServer())
          .post(`/carts/${cartId}`)
          .send({
            name: 'Test Item',
            price: 10.0,
            quantity: 2,
          });
        expect(response.status).toBe(201);
        expect(response.body.message).toEqual('Item successfully added');
        expect(response.body.cart.numberOfItems).toEqual(1);
        expect(response.body.cart.totalAmount).toEqual(20.0);
      });
    });
    describe('(PATCH) /carts/:cartId/items/:itemId', () => {
      it('should update an item in a cart', async () => {
        const cart = await createCart(app);
        const cartId = cart.body.cart.id;
        const item = {
          name: 'Test Item',
          price: 5.5,
          quantity: 2,
        };
        await addItemToCart(app, cartId, item);
        const response = await request(app.getHttpServer())
          .patch(`/carts/${cartId}/1`)
          .send({
            quantity: 3,
          });

        expect(response.status).toBe(200);
        expect(response.body.message).toEqual('item successfully updated');
        expect(response.body.Item.quantity).toEqual(3);
        expect(response.body.Item.totalPrice).toEqual(16.5);
      });
    });

    describe('(DELETE) /carts/:cartId/:itemId', () => {
      it('should delete an item from a cart', async () => {
        const cart = await createCart(app);
        const cartId = cart.body.cart.id;
        const item1 = {
          name: 'Test Item',
          price: 10.2,
          quantity: 2,
        };

        const item2 = {
          name: 'Test Item2',
          price: 20.5,
          quantity: 2,
        };

        await addItemToCart(app, cartId, item1);
        await addItemToCart(app, cartId, item2);
        const itemId = 1;
        const response = await request(app.getHttpServer()).delete(
          `/carts/${cartId}/${itemId}`,
        );

        expect(response.status).toBe(200);
        expect(response.body.message).toEqual(
          `Item with id '${itemId}' successfully deleted`,
        );
        expect(response.body.cart.numberOfItems).toEqual(1);
        expect(response.body.cart.totalAmount).toEqual(41.0);
      });
    });
  });

  afterAll(() => {
    app.close();
  });
});

const createCart = async (app) => {
  return await request(app.getHttpServer()).post('/carts').send();
};

const addItemToCart = async (app, cartId, item) => {
  return await request(app.getHttpServer()).post(`/carts/${cartId}`).send(item);
};
