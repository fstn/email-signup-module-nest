"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = exports.InvalidCodeError = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const crud_typeorm_1 = require("@nestjsx/crud-typeorm");
const class_validator_1 = require("class-validator");
const email_entity_1 = require("./email.entity");
const email_repository_1 = require("./email.repository");
exports.InvalidCodeError = new common_1.UnauthorizedException("Invalid code");
let EmailService = class EmailService extends crud_typeorm_1.TypeOrmCrudService {
    constructor(emailRepository) {
        super(emailRepository);
        this.emailRepository = emailRepository;
    }
    async create(createEmailDto) {
        const email = new email_entity_1.Email();
        const code = Math.floor(1000 + Math.random() * 9000);
        email.email = createEmailDto.email;
        email.code = code + "";
        return await this.repo.save(email);
    }
    async verifyCode(verifyCodeDto) {
        const email = await this.repo.findOne({ where: { email: verifyCodeDto.email, code: verifyCodeDto.code } });
        if (!email) {
            throw exports.InvalidCodeError;
        }
    }
    async subscribe(subscribeEmailDto) {
        const errors = await class_validator_1.validate(subscribeEmailDto);
        if (errors.length > 0) {
            throw errors;
        }
    }
};
EmailService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(email_repository_1.EmailRepository)),
    __metadata("design:paramtypes", [email_repository_1.EmailRepository])
], EmailService);
exports.EmailService = EmailService;
//# sourceMappingURL=email.service.js.map