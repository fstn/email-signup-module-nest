import {Test, TestingModule} from '@nestjs/testing';
import {LocalePublicController} from './locale.public.controller';
import {LocaleService} from "./locale.service";

describe('LocalePublicController', () => {
  let controller: LocalePublicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocalePublicController],
      providers: [
        {
          provide: LocaleService,
          useValue: {}
        }
      ]
    }).compile();

    controller = module.get<LocalePublicController>(LocalePublicController) as LocalePublicController;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
