import {
    Body,
    Controller,
    Get,
    Post,
    Request,
    Res,
    UnauthorizedException,
    UseGuards,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import { InjectSendGrid, SendGridService } from "@ntegral/nestjs-sendgrid";
import { Response } from "express";
import { getManager } from "typeorm";
import {LocalAuthGuard} from "../../auth/guards";
import {AppUserService} from "../../auth/interfaces/app-user.service";
import {AuthService} from "../../auth/interfaces/auth-service.interface";
import {SendGridConfig} from "../../auth/interfaces/send-grid.config.interface";
import {User} from "../../auth/user.entity";
import {UserAlreadyExistsError} from "../../errors";
import { CrudUtils } from "../../utils/crud.utils";
import { ChangePasswordDto, CreateEmailDto, VerifyCodeDto } from "../dtos";
import { EmailService } from "../email.service";



@Controller("api")
@UsePipes(ValidationPipe)
export class EmailController {
    constructor(
        public authService: AuthService,
        private readonly emailService: EmailService,
        private readonly appUserService: AppUserService,
        private readonly sendGridConfig: SendGridConfig,
        @InjectSendGrid() private readonly sendGridService: SendGridService
    ) {}

    @Post("/register-email")
    async registerEmail(
        @Request() req: any,
        @Body() createEmailDto: CreateEmailDto
    ) {
        try {
            const user = await this.appUserService.findByEmail(createEmailDto.email )

            if (!!user) {
                throw UserAlreadyExistsError;
            }
            const email = await this.emailService.create(createEmailDto);
            const msg = {
                to: createEmailDto.email,
                from: this.sendGridConfig.emails.signup, // Use the email address or domain you verified above
                subject: this.sendGridConfig.emails.signup.subject, //'Validate your email',
                text: this.sendGridConfig.emails.signup.text(email.code), //`This is your code: ${email.code}`,
                html: this.sendGridConfig.emails.signup.html(email.code) //`This is your code: ${email.code}`,
            };
            await this.sendGridService.send(msg);
        } catch (e) {
            await CrudUtils.antiAttack();
            throw e;
        }
    }

    @Post("/register-code")
    async registerCode(
        @Request() req: any,
        @Body() verifyCodeDto: VerifyCodeDto
    ): Promise<void> {
        try {
            return await this.emailService.verifyCode(verifyCodeDto);
        } catch (e) {
            await CrudUtils.antiAttack();
            throw e;
        }
    }

    @Post("/register")
    async register(
        @Request() req: any,
        @Body() createUserDto: any
    ): Promise<User> {
        try {
            const user = await this.appUserService.create(createUserDto)
            return user
        } catch (e) {
            await CrudUtils.antiAttack();
            throw e;
        }
    }

    @Post("/forgot-password-email")
    async forgotPasswordEmail(
        @Request() req: any,
        @Body() createEmailDto: CreateEmailDto
    ): Promise<void> {
        try {
            const user = await this.appUserService.findByEmail(createEmailDto.email )
            if (!user) {
                throw new UnauthorizedException("Invalid email");
            }
            const email = await this.emailService.create(createEmailDto);
            const msg = {
                to: email.email,
                from: this.sendGridConfig.emails.signup, // Use the email address or domain you verified above
                subject: "Validate your email",
                text: `This is your code: ${email.code}`,
                html: `This is your code: ${email.code}`
            };
            await this.sendGridService.send(msg);
        } catch (e) {
            await CrudUtils.antiAttack();
            throw e;
        }
    }

    @Post("/forgot-password-code")
    async forgotPasswordCode(
        @Request() req: any,
        @Body() verifyCodeDto: VerifyCodeDto
    ): Promise<void> {
        try {
            return await this.emailService.verifyCode(verifyCodeDto);
        } catch (e) {
            await CrudUtils.antiAttack();
            throw e;
        }
    }

    @Post("/forgot-password")
    async changePassword(
        @Request() req: any,
        @Body() changePasswordDto: ChangePasswordDto
    ): Promise<User> {
        try {
            return await this.appUserService.changePassword(changePasswordDto)
        } catch (e) {
            await CrudUtils.antiAttack();
            throw e;
        }
    }

    @Post("/login")
    @UseGuards(LocalAuthGuard)
    async signIn(@Request() req: any, @Res() res: Response): Promise<any> {
        const loginRes = await this.authService.login(req.user);
        if (req.body.remember) {
            res.cookie("token", loginRes.access_token, {
                maxAge: 4 * 30 * 24 * 60 * 60,
                httpOnly: true
            });
        } else {
            res.cookie("token", undefined, { maxAge: 0, httpOnly: true });
        }
        return res.send(loginRes);
    }
}
