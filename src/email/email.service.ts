import {Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm";
import {validate} from "class-validator";
import {EmailRepository} from "../auth/email.repository";
import {CreateEmailDto} from './dtos/create-email.dto';
import {SubscribeEmailDto} from "./dtos/subscribe-email.dto";
import {VerifyCodeDto} from './dtos/verify-code.dto';
import {Email} from "./email.entity";

export const InvalidCodeError = new UnauthorizedException("Invalid code")

@Injectable()
export class EmailService extends TypeOrmCrudService<Email> {

    constructor(
        @InjectRepository(EmailRepository)
        public emailRepository: EmailRepository) {
        super(emailRepository)
    }

    async create(createEmailDto: CreateEmailDto) {
        const email = new Email()
        const code = Math.floor(1000 + Math.random() * 9000);
        email.email = createEmailDto.email
        email.code = code + ""
        return await this.repo.save(email)
    }

    async verifyCode(verifyCodeDto: VerifyCodeDto) {
        const email = await this.repo.findOne({where: {email: verifyCodeDto.email, code: verifyCodeDto.code}})
        if (!email) {
            throw InvalidCodeError
        }
    }

    async subscribe(subscribeEmailDto: SubscribeEmailDto) {
        const errors = await validate(subscribeEmailDto)
        if (errors.length > 0) {
            throw errors
        }
        //TODO send email
    }
}
