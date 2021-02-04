import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';
import {CreateEmailDto} from "../email/dtos";
import {BaseGoogleConfiguration} from "./interfaces/base-google-configuration";

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly authConfiguration: BaseGoogleConfiguration,) {
        super({
            clientID: authConfiguration?.config?.clientId,
            clientSecret: authConfiguration?.config?.secret,
            callbackURL: authConfiguration?.config?.callbackURL,
            scope: authConfiguration?.config?.scope || ['email', 'profile'],
        });
    }


    async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { name, emails, photos } = profile
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
