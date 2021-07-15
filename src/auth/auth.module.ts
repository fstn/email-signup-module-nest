import {DynamicModule, Module} from '@nestjs/common';
import {JwtModule as NestJwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {AsyncOptions} from "../AsyncOptions";
import {EmailModule} from "../email";
import {EventModule} from "../event/event.module";
import {AppJwtModule} from "../jwt/app-jwt.module";
import {AppJwtOptionsFactory} from "../jwt/factory/jwt-options.fractory";
import {BaseJwtConfiguration} from "../jwt/interface/base-jwt-configuration";
import {LocaleModule} from "../locale/locale.module";
import {EmailController} from "./email.controller";
import {FacebookStrategy} from "./facebook.strategy";
import {GoogleStrategy} from "./google.strategy";
import {BaseAmplitudeConfiguration} from "./interfaces/base-amplitude-configuration";
import {BaseAuthService} from "./interfaces/base-auth-service";
import {BaseFacebookConfiguration} from "./interfaces/base-facebook-configuration";
import {BaseGoogleConfiguration} from "./interfaces/base-google-configuration";
import {BaseSendGridConfiguration} from "./interfaces/base-send-grid-configuration";
import {RegisterService} from "./services/register.service";
import {UserService} from "./services/user.service";
import {UserStrategy} from "./user.strategy";
import {GoogleRecaptchaModule, GoogleRecaptchaNetwork} from "@nestlab/google-recaptcha"

@Module({})
export class AuthModule {
    public static registerAsync(
        options: AsyncOptions,
    ): DynamicModule {
        return {
            module: AuthModule,
            imports: [
                ...options.imports,
                GoogleRecaptchaModule.forRoot({
                    secretKey: process.env.GOOGLE_RECAPTCHA_SECRET_KEY || "6LdxgwcUAAAAAG6KiYbTdd-cwE_2bmjQ-3osEgsB",
                    response: req => req.headers.recaptcha,
                    skipIf: process.env.NODE_ENV !== 'production',
                    network: GoogleRecaptchaNetwork.Recaptcha,
                    agent: undefined
                }),
                LocaleModule,
                EventModule.registerAsync(options),
                NestJwtModule.registerAsync({
                    imports: [AppJwtModule.registerAsync(options)],
                    useClass: AppJwtOptionsFactory
                }),
                PassportModule.register({defaultStrategy: 'jwt'}),
                EmailModule.forRoot(),
                AppJwtModule.registerAsync(options)
            ],
            controllers: [EmailController],
            providers: [
                RegisterService,
                UserService,
                FacebookStrategy,
                GoogleStrategy,
                UserStrategy,
                {
                    provide: BaseFacebookConfiguration,
                    useClass: options.useFacebookConfig
                },
                {
                    provide: BaseGoogleConfiguration,
                    useClass: options.useGoogleConfig
                },
                {
                    provide: BaseJwtConfiguration,
                    useClass: options.useJwtConfig
                },
                {
                    provide: BaseAuthService,
                    useClass: options.useService
                },
                {
                    provide: BaseAmplitudeConfiguration,
                    useClass: options.useAmplitudeConfig
                },
                {
                    provide: BaseSendGridConfiguration,
                    useClass: options.useSendGridConfig,
                },
            ],
            exports: [UserService,RegisterService],
        };
    }
}

