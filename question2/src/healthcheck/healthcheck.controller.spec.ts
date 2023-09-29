import { HealthcheckController } from './healthcheck.controller';
import { HealthcheckService } from './healthcheck.service';

describe('HealthcheckController', () => {
  let healthcheckController: HealthcheckController;
  let healthcheckService: HealthcheckService;

  beforeEach(() => {
    healthcheckService = new HealthcheckService();
    healthcheckController = new HealthcheckController(healthcheckService);
  });

  describe('findAll', () => {
    it('should return an array of cats', async () => {
      const result = { message: 'Pong!' };
      jest.spyOn(healthcheckService, 'health').mockImplementation(() => result);

      expect(await healthcheckController.health()).toBe(result);
    });
  });
});
