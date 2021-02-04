import {User} from "../user.entity";

export abstract class BaseFacebookConfiguration{
    public config!: {
        afterLoginUrlCbFactory: (payload:User,token:string)=> string;
        registerUrlFactory(param: { firstname: string; code: string;  email: string; lastname: string }): string;
        clientId: string,
        secret: string,
        callbackURL: string,
        scope?: any,
        profileFields?: string[]
    }

}
