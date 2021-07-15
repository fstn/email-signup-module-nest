import {Test, TestingModule} from '@nestjs/testing';
import {BaseAmplitudeConfiguration} from "../auth/interfaces";
import {InvalidCodeError} from "../errors";
import {getUseValueRepository} from "../utils/test";
import {CreateEmailDto} from "./dtos/create-email.dto";
import {VerifyCodeDto} from "./dtos/verify-code.dto";
import {EmailRepository} from "./email.repository";
import {EmailService} from './email.service';

describe('EmailService', () => {
    let service: EmailService;
    let repo: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [EmailService,
                {
                    provide: EmailRepository,
                    useValue: getUseValueRepository()
                },
                {
                    provide:BaseAmplitudeConfiguration,
                    useValue:{}
                }],
        }).compile();

        service = await module.get<EmailService>(EmailService) as EmailService;
        repo = await module.get<EmailRepository>(EmailRepository) as EmailRepository;
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });


    it('verifyCode should return ok', async () => {
        const dto = new VerifyCodeDto()
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        dto.code = 1234
        dto.email = "test@yopmail.com"
        repo.findOne.mockResolvedValueOnce({})
        await service.verifyCode(dto)
    });

    it('verifyCode should return ko', async () => {
        const dto = new VerifyCodeDto()
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        dto.code = 1234
        dto.email = "test@yopmail.com"
        repo.findOne.mockResolvedValueOnce(undefined)

        await expect(
            async () => {
                await service.verifyCode(dto)
            }).rejects.toThrow(InvalidCodeError);
    });


    it('create should be ok and code must not be yopmail one', async () => {
        const dto = new CreateEmailDto()
        dto.email = "test@gmail.com"
        repo.save.mockImplementation((e:any)=>e)
        const result = await service.create(dto)
        expect(repo.save).toHaveBeenCalled()
        expect(result.code).not.toBe("1111")
    });

    it('create should be ok and code must be 1111 because it\'s yopmail', async () => {
        const dto = new CreateEmailDto()
        dto.email = "test@yopmail.com"
        repo.save.mockImplementation((e:any)=>e)
        const result = await service.create(dto)
        expect(repo.save).toHaveBeenCalled()
        expect(result.code).toBe("1111")
    });
});
