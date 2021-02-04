import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Profile, Strategy} from "passport-facebook";
import {CreateEmailDto} from "../email/dtos";
import {BaseFacebookConfiguration} from "./interfaces/base-facebook-configuration";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
    constructor(
        private readonly authConfiguration: BaseFacebookConfiguration,) {
        super({
            clientID: authConfiguration?.config?.clientId,
            clientSecret: authConfiguration?.config?.secret,
            callbackURL: authConfiguration?.config?.callbackURL,
            scope: authConfiguration?.config?.scope || "email",
            profileFields: ["emails", "name", ...(authConfiguration?.config?.profileFields||[])],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (err: any, user: any, info?: any) => void
    ): Promise<any> {
        const {name, emails} = profile;
        if (!emails || emails?.length == 0) {
            throw new Error("Missing email in facebook callback data")
        }
        if (!name) {
            throw new Error("Missing name in facebook callback data")
        }
        const createEmailDto = new CreateEmailDto();
        createEmailDto.email = emails[0].value;
        createEmailDto.firstname = name.givenName
        createEmailDto.lastname = name.familyName

        const payload = {
            ...createEmailDto,
            accessToken,
        };

        done(undefined, payload);
    }
}
