export abstract class BaseGoogleConfiguration{
    config!: {
        clientId: string,
        secret: string,
        callbackUrl: string,
        scope?: string[]
    }
}
