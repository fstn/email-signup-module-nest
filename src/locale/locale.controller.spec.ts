import {Test, TestingModule} from '@nestjs/testing';
import {LocaleController} from './locale.controller';

describe('Locale Controller', () => {
  let controller: LocaleController;
  let moduleFixture: TestingModule;

  afterAll(async () => {
    await moduleFixture.close()

  })

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      controllers: [LocaleController],
      providers: [
        {
          provide: "LocaleService",
          useValue: {}
        }
      ]
    }).compile();

    controller = moduleFixture.get<LocaleController>(LocaleController) as LocaleController;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
