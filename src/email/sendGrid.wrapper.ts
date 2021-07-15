import {Injectable} from "@nestjs/common";
import {InjectSendGrid, SendGridService} from "@ntegral/nestjs-sendgrid";
import {ClientResponse} from "@sendgrid/client/src/response";
import {ResponseError} from "@sendgrid/helpers/classes";
import {MailDataRequired} from "@sendgrid/helpers/classes/mail";

@Injectable()
export class SendGridWrapper {

    constructor(
        @InjectSendGrid() private readonly sendGridService: SendGridService
    ) {
    }

    public async send(
        data: Partial<MailDataRequired> | Partial<MailDataRequired>[],
        isMultiple?: boolean,
        cb?: (err: Error | ResponseError, result: [ClientResponse, {}]) => void,
    ): Promise<[ClientResponse, {}]> {
        return this.sendGridService.send(data, isMultiple, cb)
    }

    public async sendMultiple(
        data: Partial<MailDataRequired>,
        cb?: (error: Error | ResponseError, result: [ClientResponse, {}]) => void,
    ): Promise<[ClientResponse, {}]> {
        return this.sendGridService.sendMultiple(data, cb)
    }
}
