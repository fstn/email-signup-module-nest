import {DynamicModule, Global, Module} from '@nestjs/common';
import {AsyncOptions} from "../AsyncOptions";
import {BaseAuthService} from "../auth/interfaces";
import {AppJwtOptionsFactory} from "./factory/jwt-options.fractory";
import {BaseJwtConfiguration} from "./interface/base-jwt-configuration";
import {JwtStrategy} from "./jwt.strategy";

@Global()
@Module({})
export class AppJwtModule {
    public static registerAsync(
        options: AsyncOptions,
    ): DynamicModule {
        return {
            module: AppJwtModule,
            imports: [
                ...options.imports,
            ],
            controllers: [],
            providers: [
                {
                    provide: BaseJwtConfiguration,
                    useClass: options.useJwtConfig
                },
                {
                    provide: BaseAuthService,
                    useClass: options.useService
                },
                AppJwtOptionsFactory,
                JwtStrategy
            ],
            exports: [AppJwtOptionsFactory,BaseJwtConfiguration,BaseAuthService],
        };
    }
}
