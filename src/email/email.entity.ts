import {BaseEntity, Column, Entity, PrimaryColumn} from "typeorm";

/**
 * Entity use to store signup email/code tries
 */
@Entity()
export class Email extends BaseEntity {
    @PrimaryColumn()
    email!: string

    @Column()
    code!: string
}
