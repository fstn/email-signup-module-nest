import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm";
import {Locale} from "./locale.entity";

@Injectable()
export class LocaleService extends TypeOrmCrudService<Locale> {

  constructor(@InjectRepository(Locale) public repo) {
    super(repo);
  }
}
