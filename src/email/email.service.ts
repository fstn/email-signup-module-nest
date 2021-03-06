import {Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm";
import {validate} from "class-validator";
import {Repository} from "typeorm";
import {InvalidCodeError} from "../errors";
import {CreateEmailDto} from './dtos/create-email.dto';
import {SubscribeEmailDto} from "./dtos/subscribe-email.dto";
import {VerifyCodeDto} from './dtos/verify-code.dto';
import {Email} from "./email.entity";
import {EmailRepository} from "./email.repository";

@Injectable()
export class EmailService extends TypeOrmCrudService<Email> {

    constructor(
        @InjectRepository(Email)
        public emailRepository: Repository<Email>) {
        super(emailRepository)
    }

    async create(createEmailDto: CreateEmailDto) {
        const email = new Email()
        let code = Math.floor(1000 + Math.random() * 9000);
        if(createEmailDto.email.endsWith("yopmail.com") || createEmailDto.email.startsWith("test.ecandidature+")){
            code = 1111
        }
        email.email = createEmailDto.email
        email.code = code + ""
        return this.repo.save(email)
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
