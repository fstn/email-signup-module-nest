import {
    Body,
    Controller,
    Get, HttpStatus,
    Post, Req,
    Res,
    UnauthorizedException,
    UseGuards,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {AuthGuard} from "@nestjs/passport";
import { InjectSendGrid, SendGridService } from "@ntegral/nestjs-sendgrid";
import { Response, Request } from "express";
import {LocalAuthGuard} from "./guards";
import {BaseAuthService, BaseSendGridConfiguration} from "./interfaces";
import {UserService} from "./services";
import {User} from "./user.entity";
import {InvalidCodeError, UserAlreadyExistsError} from "../errors";
import { CrudUtils } from "../utils/crud.utils";
import { ChangePasswordDto, CreateEmailDto, VerifyCodeDto } from "../email/dtos";
import { EmailService } from "../email/email.service";



@Controller("api")
@UsePipes(ValidationPipe)
export class EmailController {

    constructor(
        private readonly emailService: EmailService,
        private readonly authService: BaseAuthService,
        private readonly userService: UserService,
        private readonly sendGridConfig: BaseSendGridConfiguration,
        private jwtService: JwtService,
        @InjectSendGrid() private readonly sendGridService: SendGridService
    ) {}

    @Post("/register-email")
    async registerEmail(
        @Req() req: any,
        @Body() createEmailDto: CreateEmailDto
    ) {
        try {
            await this.userService.throwErrorIfExists(createEmailDto.email)

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
        @Req() req: any,
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
        @Req() req: any,
        @Body() createUserDto: any
    ): Promise<User> {
        try {

            const emailEntity = await this.emailService.findOne({
                where: {
                    email: createUserDto.email,
                    code: createUserDto.code
                }
            })
            if (!emailEntity) {
                throw InvalidCodeError
            }

            const user = await this.authService?.create(createUserDto)
            return user
        } catch (e) {
            await CrudUtils.antiAttack();
            throw e;
        }
    }

    @Post("/forgot-password-email")
    async forgotPasswordEmail(
        @Req() req: any,
        @Body() createEmailDto: CreateEmailDto
    ): Promise<void> {
        try {
            const user = await this.authService?.findByEmail(createEmailDto.email )
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
        @Req() req: any,
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
        @Req() req: any,
        @Body() changePasswordDto: ChangePasswordDto
    ): Promise<User> {
        try {

            const email = await this.emailService.findOne({
                where: {
                    email: changePasswordDto.email,
                    code: changePasswordDto.code
                }
            })
            if (!email) {
                throw InvalidCodeError
            }
            return await this.authService?.changePassword(changePasswordDto)
        } catch (e) {
            await CrudUtils.antiAttack();
            throw e;
        }
    }

    @Post("/login")
    @UseGuards(LocalAuthGuard)
    async signIn(@Req() req: any, @Res() res: Response): Promise<any> {
        const payload = await this.authService?.login(req.user);
        const access_token= this.jwtService.sign(payload)
        if (req.body.remember) {
            res.cookie("token", access_token, {
                maxAge: 4 * 30 * 24 * 60 * 60,
                httpOnly: true
            });
        } else {
            res.cookie("token", undefined, { maxAge: 0, httpOnly: true });
        }
        return res.send({payload,access_token});
    }

    @Get("/facebook")
    @UseGuards(AuthGuard("facebook"))
    async facebookLogin(): Promise<any> {
        return HttpStatus.OK;
    }

    @Get("/facebook/redirect")
    @UseGuards(AuthGuard("facebook"))
    async facebookLoginRedirect(@Req() req: Request): Promise<any> {

        const createEmailDto = req.user as CreateEmailDto
        await this.userService.throwErrorIfExists(createEmailDto.email)
        const email = await this.emailService.create(createEmailDto);
        return {
            statusCode: HttpStatus.OK,
            data: req.user,
        };
    }

    @Get()
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req: Request) {}

    @Get('redirect')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: Request) {
        const createEmailDto = req.user as CreateEmailDto
        await this.userService.throwErrorIfExists(createEmailDto.email)
        const email = await this.emailService.create(createEmailDto);
        return {
            statusCode: HttpStatus.OK,
            data: req.user,
        };
    }
}
