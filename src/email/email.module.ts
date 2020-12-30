import {DynamicModule, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Email} from "./email.entity";
import {EmailService} from './email.service';

export declare type EmailModuleOptions = {
} ;

@Module({
})
export class EmailModule {
    static forRoot(options?: EmailModuleOptions): DynamicModule {
        return {
            module:EmailModule,
            imports: [
                TypeOrmModule.forFeature([Email]),
            ],
            providers: [EmailService],
            exports: [EmailService]
        }
    }
}
