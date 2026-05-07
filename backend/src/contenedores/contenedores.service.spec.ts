import { Test, TestingModule } from '@nestjs/testing';
import { ContenedoresService } from './contenedores.service';

describe('ContenedoresService', () => {
  let service: ContenedoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContenedoresService],
    }).compile();

    service = module.get<ContenedoresService>(ContenedoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
