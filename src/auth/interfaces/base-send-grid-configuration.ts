export abstract class BaseSendGridConfiguration {
    emails!: {
        signup: {
            email: string,
            subject: string,
            text: (code:string)=>string,
            html: (code:string)=>string
        }
    }
    keys!: {
        default: string,
        full: string
    }
}
