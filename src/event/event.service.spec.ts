import { Test, TestingModule } from '@nestjs/testing';
import {BaseAmplitudeConfiguration} from "../auth/interfaces";
import { EventService } from './event.service';

describe('EventService', () => {
  let service: EventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventService,{
        provide:BaseAmplitudeConfiguration,
        useValue:{config:{key:""}}
      }],
    }).compile();

    service = module.get<EventService>(EventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
