import {BaseEntity, Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class UserRole extends BaseEntity {
  @PrimaryColumn()
  public name!: string
  //@Expose({name: 'name'})

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  public permissions!: string[]
  //@Expose({name: 'permissions'})

}
