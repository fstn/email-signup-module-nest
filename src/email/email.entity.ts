import {Column, Entity, PrimaryColumn} from "typeorm";
import {VersionedBase} from "../common/versioned-base.entity";

/**
 * Entity use to store signup email/code tries
 */
@Entity()
export class Email extends VersionedBase {
    @PrimaryColumn()
    email: string

    @Column()
    code: string
}
