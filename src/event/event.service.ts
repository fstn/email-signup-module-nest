import * as Amplitude from '@amplitude/node';
import {NodeClient} from "@amplitude/node/dist/src/nodeClient";
import {Event} from "@amplitude/types";
import {Injectable} from '@nestjs/common';
import {BaseAmplitudeConfiguration} from "../auth/interfaces/base-amplitude-configuration";


/**
 * Service to log amplitude events
 */
@Injectable()
export class EventService {

    private client: NodeClient;

    constructor(private config: BaseAmplitudeConfiguration) {
        this.client = Amplitude.init(config.config.key);
    }

    public async log(event: Event) {
        await this.client.logEvent(event);
    }
}
