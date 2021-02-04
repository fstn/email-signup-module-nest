import {
    Body,
    Controller, Delete,
    Get,
    HttpStatus,
    Post,
    Req,
    Res,
    UnauthorizedException,
    UseGuards,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {AuthGuard} from "@nestjs/passport";
import {InjectSendGrid, SendGridService} from "@ntegral/nestjs-sendgrid";
import {Request, Response} from "express";
import {ChangePasswordDto, CreateEmailDto, VerifyCodeDto} from "../email/dtos";
import {PreLoginDto} from "../email/dtos/pre-login.dto";
import {EmailService} from "../email/email.service";
import {InvalidCodeError, UserAlreadyExistsError} from "../errors";
import {EventService} from "../event/event.service";
import {CrudUtils} from "../utils/crud.utils";
import {LocalAuthGuard} from "./guards";
import {
    BaseAuthService,
    BaseFacebookConfiguration,
    BaseGoogleConfiguration,
    BaseSendGridConfiguration
} from "./interfaces";
import {UserService} from "./services";
import {User} from "./user.entity";


@Controller("api")
@UsePipes(ValidationPipe)
export class EmailController {

    constructor(
        private readonly emailService: EmailService,
        private readonly authService: BaseAuthService,
        private readonly userService: UserService,
        private readonly sendGridConfig: BaseSendGridConfiguration,
        private readonly facebookConfiguration: BaseFacebookConfiguration,
        private readonly googleConfiguration: BaseGoogleConfiguration,
        private readonly eventService: EventService,
        private jwtService: JwtService,
        @InjectSendGrid() private readonly sendGridService: SendGridService
    ) {
    }

    @Post("/register-email")
    async registerEmail(
        @Req() req: any,
        @Body() createEmailDto: CreateEmailDto
    ) {
        try {
            await this.userService.throwErrorIfExists(createEmailDto.email)

            const email = await this.emailService.create(createEmailDto);
            await this.eventService.log({event_type:"register.email",user_id:createEmailDto.email})
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
            await this.eventService.log({event_type:"register.code",user_id:verifyCodeDto.email})
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
            await this.eventService.log({event_type:"register",user_id:createUserDto.email})
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
            const user = await this.authService?.findByEmail(createEmailDto.email)
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
            await this.eventService.log({event_type:"forget.password",user_id:changePasswordDto.email})
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

    @Post("/pre-login")
    async preLogin(  @Req() req: any,
                     @Body() preLoginDto: PreLoginDto
    ): Promise<boolean> {
        try {
            const user = await this.authService.findByEmail(preLoginDto.email)
            return !!user
        } catch (e) {
            await CrudUtils.antiAttack();
            throw e;
        }
    }

    @Post("/login")
    @UseGuards(LocalAuthGuard)
    async signIn(@Req() req: any, @Res() res: Response): Promise<any> {
        const {payload, access_token} = await this.createAccessToken(req.user);
        let cookie = this.createCookie(req.body.remember);
        res.cookie("token", access_token, cookie);
        return res.send({payload, access_token});
    }

    @Delete("/login")
    async logout(@Req() req: any, @Res() res: Response): Promise<any> {
        let cookie = this.createCookie(true);
        await this.eventService.log({event_type:"login",user_id:req.user.email})
        res.cookie("token", undefined, cookie);
        return res.send();
    }

    private async createAccessToken(createEmailDto: any) {
        const user = await this.authService.findByEmail(createEmailDto.email)
        if (!user) {
            throw new UnauthorizedException()
        }
        const payload = await this.authService?.login(user);
        const access_token = this.jwtService.sign(payload)
        return {payload, access_token};
    }

    @Get("/facebook")
    @UseGuards(AuthGuard("facebook"))
    async facebookLogin(): Promise<any> {
        return HttpStatus.OK;
    }

    @Get("/facebook/redirect")
    @UseGuards(AuthGuard("facebook"))
    async facebookLoginRedirect(@Req() req: Request, @Res() res: Response): Promise<any> {

        const createEmailDto = req.user as CreateEmailDto
        try {
            await this.eventService.log({event_type:"login.facebook",user_id:createEmailDto.email})
            await this.userService.throwErrorIfExists(createEmailDto.email)
            const email = await this.emailService.create(createEmailDto);
            return res.redirect(this.facebookConfiguration.config.registerUrlFactory({...email, ...createEmailDto}));
        } catch (e) {
            if (e === UserAlreadyExistsError) {
                return await this.redirectIfAlreadyExists(createEmailDto, res, this.facebookConfiguration.config.afterLoginUrlCbFactory);
            } else
                throw e
        }

    }

    @Get("/google")
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req: Request) {
    }

    @Get('/google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: Request, @Res() res: Response): Promise<any> {

        const createEmailDto = req.user as CreateEmailDto
        try {
            await this.eventService.log({event_type:"login.google",user_id:createEmailDto.email})
            await this.userService.throwErrorIfExists(createEmailDto.email)
            const email = await this.emailService.create(createEmailDto);
            return res.redirect(this.googleConfiguration.config.registerUrlFactory({...email, ...createEmailDto}));
        } catch (e) {
            if (e === UserAlreadyExistsError)
                return await this.redirectIfAlreadyExists(createEmailDto, res, this.googleConfiguration.config.afterLoginUrlCbFactory);
            else
                throw e
        }

    }

    /**
     * Create auth cookie
     * @param remember
     * @private
     */
    private createCookie(remember: boolean) {
        let cookie = {maxAge: 0, httpOnly: true}
        if (remember) {
            cookie = {
                maxAge: 4 * 30 * 24 * 60 * 60,
                httpOnly: true
            }
        }
        return cookie;
    }


    /**
     * Log user and redirect it if he already exists in app
     * @param req
     * @param res
     * @private
     */
    private async redirectIfAlreadyExists(createEmailDto: CreateEmailDto, res: Response, callBack: Function) {
        const {payload, access_token} = await this.createAccessToken(createEmailDto);
        let cookie = this.createCookie(true);
        res.cookie("token", access_token, cookie);
        return res.redirect(callBack(payload, access_token));
    }

}
