import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Post,
    Put,
    Req,
    Res,
    UnauthorizedException,
    UseGuards,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {AuthGuard} from "@nestjs/passport";
import {Recaptcha} from "@nestlab/google-recaptcha";
import {InjectSendGrid, SendGridService} from "@ntegral/nestjs-sendgrid";
import {Request, Response} from "express";
import {ChangePasswordDto, CreateEmailDto, VerifyCodeDto} from "../email/dtos";
import {PreLoginDto} from "../email/dtos/pre-login.dto";
import {EmailService} from "../email/email.service";
import {SendGridWrapper} from "../email/sendGrid.wrapper";
import {InvalidCodeError, UserAlreadyExistsError} from "../errors";
import {EventService} from "../event/event.service";
import {CrudUtils} from "../utils/crud.utils";
import {JwtAuthGuard, LocalAuthGuard} from "./guards";
import {
    BaseAuthService,
    BaseFacebookConfiguration,
    BaseGoogleConfiguration,
    BaseSendGridConfiguration
} from "./interfaces";
import {UserService} from "./services";
import {RegisterService} from "./services/register.service";
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
        private readonly jwtService: JwtService,
        private readonly sendGridService: SendGridWrapper,
        private readonly registerService: RegisterService
    ) {
    }

    @Post("/register-email")
    @Recaptcha()
    async registerEmail(
        @Req() req: any,
        @Body() createEmailDto: CreateEmailDto
    ) {
        try {
            await this.userService.throwErrorIfExists(createEmailDto.email)
            await this.eventService.log({event_type:"register.email",user_id:createEmailDto.email})

           return this.registerService.registerEmail(createEmailDto)
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
            await this.eventService.log({event_type: "register.code", user_id: verifyCodeDto.email})
            return await this.emailService.verifyCode(verifyCodeDto);
        } catch (e) {
            await CrudUtils.antiAttack();
            throw e;
        }
    }

    /**
     * Register new User
     * @param req
     * @param createUserDto
     */
    @Post("/register")
    async register(
        @Req() req: any,
        @Body() createUserDto: any
    ): Promise<User> {
        try {
            await this.eventService.log({event_type: "register", user_id: createUserDto.email})
            return this.registerService.register(createUserDto)
        } catch (e) {
            await CrudUtils.antiAttack();
            throw e;
        }
    }

    /**
     * Verify Email for forgot Password
     * @param req
     * @param createEmailDto
     */
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

    /**
     * Verify Code for forgot password
     * @param req
     * @param verifyCodeDto
     */
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

    /**
     * Change Password
     * @param req
     * @param changePasswordDto
     */
    @Post("/forgot-password")
    async forgotPassword(
        @Req() req: any,
        @Body() changePasswordDto: ChangePasswordDto
    ): Promise<User> {
        try {
            await this.eventService.log({event_type: "forget.password", user_id: changePasswordDto.email})
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

    /**
     * Pre Login
     * @param req
     * @param preLoginDto
     */
    @Post("/pre-login")
    async preLogin(@Req() req: any,
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

    /**
     * Login
     * @param req
     * @param res
     */
    @Post("/login")
    @UseGuards(LocalAuthGuard)
    async signIn(@Req() req: any, @Res() res: Response): Promise<any> {
        await this.eventService.log({event_type: "login", user_id: req.user?.email})
        return await this.userService.signIn(req.user, req.body.remember, res);
    }

    /**
     * Logout
     * @param req
     * @param res
     */
    @Delete("/login")
    async logout(@Req() req: any, @Res() res: Response): Promise<any> {
        await this.eventService.log({event_type: "logout", user_id: req?.user?.email})
        return this.userService.logout(res);
    }

    /**
     * Facebook Login
     */
    @Get("/facebook")
    @UseGuards(AuthGuard("facebook"))
    async facebookLogin(): Promise<any> {
        return HttpStatus.OK;
    }

    /**
     * Redirect for Facebook OAuth
     * @param req
     * @param res
     */
    @Get("/facebook/redirect")
    @UseGuards(AuthGuard("facebook"))
    async facebookLoginRedirect(@Req() req: Request, @Res() res: Response): Promise<any> {

        const createEmailDto = req.user as CreateEmailDto
        try {
            await this.eventService.log({event_type: "login.facebook", user_id: createEmailDto.email})
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

    /**
     * Redirect for Google OAuth
     * @param req
     * @param res
     */
    @Get('/google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: Request, @Res() res: Response): Promise<any> {

        const createEmailDto = req.user as CreateEmailDto
        try {
            await this.eventService.log({event_type: "login.google", user_id: createEmailDto.email})
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
     * Set cookie on request
     * @param req
     * @param res
     */
    @Get("/cookie")
    @UseGuards(JwtAuthGuard)
    async cookie(
        @Req() req: any,
        @Res() res: any) {
        try {
            const {access_token} = await this.userService.createAccessToken(await this.authService.findByEmail(req.user.email));
            let cookie = this.userService.createCookie(true);
            //rgpd is in token so we need to update it
            res.cookie("token", access_token, cookie);
        } catch (e) {
            await CrudUtils.antiAttack();
            throw e;
        }
        return res.send();
    }

    /**
     * Remove RGPD
     * @param req
     * @param res
     */
    @Put("/rgpd/unset")
    @UseGuards(JwtAuthGuard)
    async unsetRgpd(
        @Req() req: any,
        @Res() res: any) {
        try {
            req.user.rgpd = null
            await this.authService?.update(req.user)
            const {payload, access_token} = await this.userService.createAccessToken(req.user);
            let cookie = this.userService.createCookie(true);
            //rgpd is in token so we need to update it
            res.cookie("token", access_token, cookie);
        } catch (e) {
            await CrudUtils.antiAttack();
            throw e;
        }
        return res.send();
    }

    /**
     * Accept RGPD
     * @param req
     * @param res
     */
    @Put("/rgpd/accept")
    @UseGuards(JwtAuthGuard)
    async acceptRgpd(
        @Req() req: any,
        @Res() res: any) {
        try {
            req.user.rgpd = true
            await this.authService?.update(req.user)
            const {payload, access_token} = await this.userService.createAccessToken(req.user);
            let cookie = this.userService.createCookie(true);
            //rgpd is in token so we need to update it
            res.cookie("token", access_token, cookie);
        } catch (e) {
            await CrudUtils.antiAttack();
            throw e;
        }
        return res.send();
    }

    @Put("/rgpd/refuse")
    @UseGuards(JwtAuthGuard)
    async refuseRgpd(
        @Req() req: any,
        @Res() res: any
    ) {
        try {
            //user is huge remove candidate file
            req.user.rgpd = false
            await this.authService?.update(req.user)
            const {payload, access_token} = await this.userService.createAccessToken(req.user);
            let cookie = this.userService.createCookie(true);
            //rgpd is in token so we need to update it
            res.cookie("token", access_token, cookie);
        } catch (e) {
            await CrudUtils.antiAttack();
            throw e;
        }
        return res.send();
    }

    /**
     * Log user and redirect it if he already exists in app
     * @param req
     * @param res
     * @private
     */
    private async redirectIfAlreadyExists(createEmailDto: CreateEmailDto, res: Response, callBack: Function) {
        const {payload, access_token} = await this.userService.createAccessToken(createEmailDto);
        let cookie = this.userService.createCookie(true);
        res.cookie("token", access_token, cookie);
        return res.redirect(callBack(payload, access_token));
    }

}

