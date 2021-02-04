export abstract class BaseSendGridConfiguration {
    public emails!: {
        signup: {
            email: string,
            subject: string,
            text: (code:string)=>string,
            html: (code:string)=>string
        }
    }
    public keys!: {
        default: string,
        full: string
    }
}
