import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from 'passport-jwt'
import {JwtConstants} from "./interfaces/jwt-constants.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private jwtConstants: JwtConstants) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromUrlQueryParameter("access_token"),
                ExtractJwt.fromAuthHeaderAsBearerToken(),
                (req) => {
                    return req?.cookies?.token
                }]),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

    async validate(payload: any) {
        return payload;
    }
}
