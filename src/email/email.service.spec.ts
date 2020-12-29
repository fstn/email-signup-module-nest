import {Test, TestingModule} from '@nestjs/testing';
import {EmailRepository} from "../auth/email.repository";
import {getUseValueRepository} from "../utils/test";
import {CreateEmailDto} from "./dtos/create-email.dto";
import {VerifyCodeDto} from "./dtos/verify-code.dto";
import {EmailService, InvalidCodeError} from './email.service';

describe('EmailService', () => {
    let service: EmailService;
    let repo: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [EmailService,
                {
                    provide: EmailRepository,
                    useValue: getUseValueRepository()
                }],
        }).compile();

        service = module.get<EmailService>(EmailService) as EmailService;
        repo = module.get<EmailRepository>(EmailRepository) as EmailRepository;
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


    it('create should be ok', async () => {
        const dto = new CreateEmailDto()
        dto.email = "test@yopmail.com"
        await service.create(dto)
        expect(repo.save).toHaveBeenCalled()
    });
});
