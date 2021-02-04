import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {LocaleController} from './locale.controller';
import {Locale} from "./locale.entity";
import {LocalePublicController} from "./locale.public.controller";
import {LocaleService} from './locale.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Locale]),],
  providers: [LocaleService],
  exports: [LocaleService],
  controllers: [LocaleController, LocalePublicController]
})
export class LocaleModule {
}
