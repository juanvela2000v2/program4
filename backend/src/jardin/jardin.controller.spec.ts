import { Test, TestingModule } from '@nestjs/testing';
import { JardinController } from './jardin.controller';

describe('JardinController', () => {
  let controller: JardinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JardinController],
    }).compile();

    controller = module.get<JardinController>(JardinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
