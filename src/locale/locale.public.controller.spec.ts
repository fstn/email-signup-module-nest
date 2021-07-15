import {Test, TestingModule} from '@nestjs/testing';
import {LocalePublicController, mapLocale} from './locale.public.controller';
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

  it('mapLocale should extract locale from id', () => {
    expect(mapLocale({id:"Profile.avatarDocument.label.html",value:undefined}))
        .toEqual({"Profile.avatarDocument.label.html": "Profile.avatarDocument"});
    expect(mapLocale({id:"Errror de dossoso.label.html",value:undefined}))
        .toEqual({"Errror de dossoso.label.html":"Errror de dossoso"});
  });


});
