import { Test, TestingModule } from '@nestjs/testing';
import { TemperaturaService } from './temperatura.service';

describe('TemperaturaService', () => {
  let service: TemperaturaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TemperaturaService],
    }).compile();

    service = module.get<TemperaturaService>(TemperaturaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
