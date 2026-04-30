import { Test, TestingModule } from '@nestjs/testing';
import { TemperaturaController } from './temperatura.controller';

describe('TemperaturaController', () => {
  let controller: TemperaturaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemperaturaController],
    }).compile();

    controller = module.get<TemperaturaController>(TemperaturaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
