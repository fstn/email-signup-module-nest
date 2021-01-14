import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from 'passport-jwt'
import {BaseJwtConfiguration} from "./interfaces";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configuration: BaseJwtConfiguration) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromUrlQueryParameter("access_token"),
                ExtractJwt.fromAuthHeaderAsBearerToken(),
                (req) => {
                    return req?.cookies?.token
                }]),
            ignoreExpiration: false,
            secretOrKey: configuration.config?.secret,
        });
    }

    async validate(payload: any) {
        return payload;
    }
}
