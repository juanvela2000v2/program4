import { Test, TestingModule } from '@nestjs/testing';
import { ContenedoresController } from './contenedores.controller';

describe('ContenedoresController', () => {
  let controller: ContenedoresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContenedoresController],
    }).compile();

    controller = module.get<ContenedoresController>(ContenedoresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
