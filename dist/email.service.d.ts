import { UnauthorizedException } from '@nestjs/common';
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { CreateEmailDto } from './dtos/create-email.dto';
import { SubscribeEmailDto } from "./dtos/subscribe-email.dto";
import { VerifyCodeDto } from './dtos/verify-code.dto';
import { Email } from "./email.entity";
import { EmailRepository } from "./email.repository";
export declare const InvalidCodeError: UnauthorizedException;
export declare class EmailService extends TypeOrmCrudService<Email> {
    emailRepository: EmailRepository;
    constructor(emailRepository: EmailRepository);
    create(createEmailDto: CreateEmailDto): Promise<Email>;
    verifyCode(verifyCodeDto: VerifyCodeDto): Promise<void>;
    subscribe(subscribeEmailDto: SubscribeEmailDto): Promise<void>;
}
