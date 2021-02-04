import {DynamicModule, Global, Module} from '@nestjs/common';
import {AsyncOptions} from "../AsyncOptions";
import {BaseAmplitudeConfiguration} from "../auth/interfaces/base-amplitude-configuration";
import {EventService} from './event.service';

@Global()
@Module({})
export class EventModule {
    public static registerAsync(
        options: AsyncOptions,
    ): DynamicModule {
        return {
            module: EventModule,
            imports: [
                ...options.imports,
            ],
            controllers: [],
            providers: [
                EventService,
                {
                    provide: BaseAmplitudeConfiguration,
                    useClass: options.useAmplitudeConfig
                }
            ],
            exports: [EventService],
        };

    }
}
