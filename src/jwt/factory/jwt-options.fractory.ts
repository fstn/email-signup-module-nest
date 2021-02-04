import {Injectable} from "@nestjs/common";
import {JwtModuleOptions, JwtOptionsFactory} from "@nestjs/jwt/dist/interfaces/jwt-module-options.interface";
import {BaseJwtConfiguration} from "../interface/base-jwt-configuration";

@Injectable()
export class AppJwtOptionsFactory implements  JwtOptionsFactory {
    constructor(private readonly baseJwtConfiguration: BaseJwtConfiguration) {
    }
    createJwtOptions(): JwtModuleOptions{
        return this.baseJwtConfiguration.config
    }
}
