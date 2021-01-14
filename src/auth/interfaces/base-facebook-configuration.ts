export abstract class BaseFacebookConfiguration{
    config!: {
        clientId: string,
        secret: string,
        callbackUrl: string,
        scope?: any,
        profileFields?: string[]
    }

}
