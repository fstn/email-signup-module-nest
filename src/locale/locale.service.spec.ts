import {Test, TestingModule} from '@nestjs/testing';
import {getUseValueRepository} from "../utils/test";
import {LocaleService} from './locale.service';


describe('LocaleService', () => {
  let service: LocaleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocaleService,
        {
          provide: "LocaleRepository",
          useValue: getUseValueRepository()
        },],
    }).compile();

    service = module.get<LocaleService>(LocaleService) as LocaleService;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
