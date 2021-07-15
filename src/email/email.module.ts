import {DynamicModule, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "../auth";
import {Email} from "./email.entity";
import {EmailService} from './email.service';
import {SendGridWrapper} from "./sendGrid.wrapper";

export type EmailModuleOptions = {
} ;

@Module({
})
export class EmailModule {
    static forRoot(options?: EmailModuleOptions): DynamicModule {
        return {
            module:EmailModule,
            imports:[TypeOrmModule.forFeature([Email]), AuthModule],
            providers: [EmailService,SendGridWrapper],
            exports: [EmailService,SendGridWrapper]
        }
    }
}
