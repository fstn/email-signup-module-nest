"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const test_1 = require("../utils/test");
const create_email_dto_1 = require("./dtos/create-email.dto");
const verify_code_dto_1 = require("./dtos/verify-code.dto");
const email_repository_1 = require("./email.repository");
const email_service_1 = require("./email.service");
describe('EmailService', () => {
    let service;
    let repo;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [email_service_1.EmailService,
                {
                    provide: email_repository_1.EmailRepository,
                    useValue: test_1.getUseValueRepository()
                }],
        }).compile();
        service = module.get(email_service_1.EmailService);
        repo = module.get(email_repository_1.EmailRepository);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('verifyCode should return ok', async () => {
        const dto = new verify_code_dto_1.VerifyCodeDto();
        dto.code = 1234;
        dto.email = "test@yopmail.com";
        repo.findOne.mockResolvedValueOnce({});
        await service.verifyCode(dto);
    });
    it('verifyCode should return ko', async () => {
        const dto = new verify_code_dto_1.VerifyCodeDto();
        dto.code = 1234;
        dto.email = "test@yopmail.com";
        repo.findOne.mockResolvedValueOnce(undefined);
        await expect(async () => {
            await service.verifyCode(dto);
        }).rejects.toThrow(email_service_1.InvalidCodeError);
    });
    it('create should be ok', async () => {
        const dto = new create_email_dto_1.CreateEmailDto();
        dto.email = "test@yopmail.com";
        await service.create(dto);
        expect(repo.save).toHaveBeenCalled();
    });
});
//# sourceMappingURL=email.service.spec.js.map