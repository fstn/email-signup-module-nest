import {DynamicModule, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "../auth";
import {Email} from "./email.entity";
import {EmailService} from './email.service';

export type EmailModuleOptions = {
} ;

@Module({
})
export class EmailModule {
    static forRoot(options?: EmailModuleOptions): DynamicModule {
        return {
            module:EmailModule,
            imports:[TypeOrmModule.forFeature([Email]), AuthModule],
            providers: [EmailService],
            exports: [EmailService]
        }
    }
}
