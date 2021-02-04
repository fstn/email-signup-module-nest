import {Column, Entity} from "typeorm";
import {VersionedBaseStringIdEntity} from "../common/versioned-base-string-id.entity";

@Entity()
export class Locale extends VersionedBaseStringIdEntity {

  @Column({nullable: true, type: "text"})
  public value: string
}
