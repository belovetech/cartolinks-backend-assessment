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

  afterAll(() => {
    app.close();
  });
});
