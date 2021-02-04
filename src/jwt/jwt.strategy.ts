import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from 'passport-jwt'
import {BaseJwtConfiguration} from "./interface/base-jwt-configuration";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configuration: BaseJwtConfiguration) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromUrlQueryParameter("access_token"),
                (req) => {
                    if (!req.cookies) {
                        console.log("Cookies are empty, please verify that your app is using cookie-parser ")
                    }
                    return req?.cookies?.token
                },
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: configuration.config?.secret,
        });
    }

    async validate(payload: any) {
        return payload;
    }
}
