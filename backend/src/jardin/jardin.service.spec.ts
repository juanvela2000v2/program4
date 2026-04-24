import { Test, TestingModule } from '@nestjs/testing';
import { JardinService } from './jardin.service';

describe('JardinService', () => {
  let service: JardinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JardinService],
    }).compile();

    service = module.get<JardinService>(JardinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
