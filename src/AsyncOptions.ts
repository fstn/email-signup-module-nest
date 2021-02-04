import {Type} from "@nestjs/common";
import {
    BaseAuthService,
    BaseFacebookConfiguration,
    BaseGoogleConfiguration,
    BaseSendGridConfiguration
} from "./auth/interfaces";
import {BaseAmplitudeConfiguration} from "./auth/interfaces/base-amplitude-configuration";
import {BaseJwtConfiguration} from "./jwt/interface";

export type AsyncOptions = {
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
    /*
        Amplitude configuration
     */
    useAmplitudeConfig: Type<BaseAmplitudeConfiguration>
};
