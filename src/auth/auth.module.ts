import {DynamicModule, Module} from '@nestjs/common';
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {TypeOrmModule} from "@nestjs/typeorm";
import {EmailModule} from "../email";
import {AuthService} from "./interfaces/auth-service.interface";
import {SendGridConfig} from "./interfaces/send-grid.config.interface";
import {JwtStrategy} from "./jwt.strategy";
import {UserService} from "./services/user.service";
import {UserRole} from "./user-role.entity";
import {UserStrategy} from "./user.strategy";

export declare type AuthModuleOptions = {
    jwtConstants: { secret: string }
    sendGridConfig: SendGridConfig
    authService: AuthService

};

@Module({})
export class AuthModule {
    static forRoot(options: AuthModuleOptions): DynamicModule {
        return {
            module: AuthModule,
            imports: [
                JwtModule.register({
                    secret: options.jwtConstants.secret,
                    signOptions: {
                        expiresIn: 360000
                    }
                }),
                PassportModule.register({defaultStrategy: 'jwt'}),
                TypeOrmModule.forFeature([UserRole]),
                EmailModule],
            controllers: [],
            providers: [JwtStrategy,
                UserService,
                UserStrategy,
                {
                    provide: "SendGridConfig",
                    useValue: options.sendGridConfig
                },
                {
                    provide: "AuthService",
                    useValue: options.authService
                },
                {
                    provide: "JwtConstants",
                    useValue: options.jwtConstants
                }
            ],
            exports: [
                JwtStrategy,
                UserService,
                PassportModule,
            ]
        }
    }

    //AuthService
    //jwtConstants
}
