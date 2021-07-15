import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class Locale {
    @PrimaryColumn()
    public id!: string;

    @Column({nullable: true, type: "text"})
    public value?: string
}
