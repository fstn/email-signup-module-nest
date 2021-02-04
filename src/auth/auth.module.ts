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
import {UserService} from "./services/user.service";
import {UserStrategy} from "./user.strategy";


@Module({})
export class AuthModule {
    public static registerAsync(
        options: AsyncOptions,
    ): DynamicModule {
        return {
            module: AuthModule,
            imports: [
                ...options.imports,
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
            exports: [],
        };
    }
}

