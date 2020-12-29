import {EntityRepository, Repository} from "typeorm";
import {Email} from "../email/email.entity";

@EntityRepository(Email)
export class EmailRepository extends Repository<Email> {

}
