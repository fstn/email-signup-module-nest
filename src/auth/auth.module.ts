import {DynamicModule, Module, Provider, Type} from '@nestjs/common';
import {BaseGoogleConfiguration} from "./interfaces/base-google-configuration";
import {BaseFacebookConfiguration} from "./interfaces/base-facebook-configuration";
import {BaseAuthService} from "./interfaces/base-auth-service";
import {BaseJwtConfiguration} from "./interfaces/base-jwt-configuration";
import {BaseSendGridConfiguration} from "./interfaces/base-send-grid-configuration";
import {JwtStrategy} from "./jwt.strategy";
import {UserService} from "./services/user.service";
import {UserStrategy} from "./user.strategy";


@Module({})
export class AuthModule {
    public static registerAsync(
        options: {
            /*
                Imports use by other services, generally ConfigModule
            */
            imports: any[],
            /*
                Facebook configuration
             */
            useFacebookConfig: Type<BaseFacebookConfiguration>,
            /*
                Google configuration
             */
            useGoogleConfig: Type<BaseGoogleConfiguration>,
            /*
                JWT configuration
             */
            useJwtConfig: Type<BaseJwtConfiguration>,
            /*
                Auth service
             */
            useService: Type<BaseAuthService>,
            /*
                SendGrid configuration
             */
            useSendGridConfig: Type<BaseSendGridConfiguration>
        },
    ): DynamicModule {
        return {
            module: AuthModule,
            imports: options.imports,
            providers: [
                JwtStrategy,
                UserService,
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
                    provide: BaseSendGridConfiguration,
                    useClass: options.useSendGridConfig,
                },
            ],
            exports: [],
        };
    }
}
