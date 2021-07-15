import {Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {CreateEmailDto, EmailService, SendGridWrapper} from "../../email";
import {InvalidCodeError} from "../../errors";
import {BaseAuthService, BaseSendGridConfiguration} from "../interfaces";

@Injectable()
export class RegisterService {

    constructor(
        private readonly authService: BaseAuthService,
        private readonly sendGridConfig: BaseSendGridConfiguration,
        private readonly sendGridService: SendGridWrapper,
        private emailService: EmailService) {
    }

    /**
     * Register User
     */
    public async register(registerDto: any) {
        const emailEntity = await this.emailService.findOne({
            where: {
                email: registerDto.email,
                code: registerDto.code
            }
        })
        if (!emailEntity) {
            throw InvalidCodeError
        }
        return this.authService?.create(registerDto)
    }

    /**
     * Register Email
     * @param createEmailDto
     */
    public async registerEmail(createEmailDto: CreateEmailDto) {
        const email = await this.emailService.create(createEmailDto);
        const msg = {
            to: createEmailDto.email,
            from: this.sendGridConfig.emails.signup, // Use the email address or domain you verified above
            subject: this.sendGridConfig.emails.signup.subject, //'Validate your email',
            text: this.sendGridConfig.emails.signup.text(email.code), //`This is your code: ${email.code}`,
            html: this.sendGridConfig.emails.signup.html(email.code) //`This is your code: ${email.code}`,
        };
        await this.sendGridService.send(msg);
    }
}
