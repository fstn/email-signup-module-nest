import {MapToForSnapshot} from "@fstn/typescript-jest-snapshot-mapper";
import {remove} from "@fstn/typescript-jest-snapshot-mapper/dist/utils/mapper";
import * as bcrypt from 'bcrypt'
import {Exclude, Transform} from "class-transformer";

import {IsEmail, IsIn, IsNotEmpty, IsOptional} from "class-validator";
import * as faker from "faker";
import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, TableInheritance, Unique} from "typeorm";
import {Empty, Fake, TestSafe} from "../context";
import {UserRole} from "./user-role.entity";

export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @MapToForSnapshot("dynamic_candidate")(remove)
  public id!: string;

  @Fake(faker.name.firstName)
  @Empty((context:any) => context?.firstName)
  @IsNotEmpty()
  @Column({nullable: true})
  public firstName!: string;
  //@Expose({name: 'firstName'})

  @Fake(faker.name.lastName)
  @Empty((context:any) => context?.lastName)
  @IsNotEmpty()
  @Column({nullable: true})
  public lastName!: string;
  //@Expose({name: 'lastName'})

  @Fake((c:any) => c.email || faker.internet.exampleEmail())
  @Empty((context:any) => context?.email)
  @IsNotEmpty()
  @IsEmail(undefined)
  @Unique(['email'])
  @Column({nullable: true})
  public email!: string;
  //@Expose({name: 'email'})

  @Exclude()
  @MapToForSnapshot("dynamic_candidate")(remove)
  @Fake((c:any) => c.password || faker.internet.password(8, true))
  @Empty((c:any) => bcrypt.hashSync(c?.password || faker.internet.password(8, true), 8))
  @Column({nullable: true})
  public password!: string
  //@Expose({name: 'password'})

  @ManyToOne(() => UserRole, {cascade: false, eager: true, nullable: true})
  //@Expose({name: 'role'})
  // @ts-ignore
  @Transform(role => role?.name)
  // @ts-ignore
  public role: UserRole

  @Fake(faker.random.arrayElement, ["m", "f"])
  @Column({nullable: true})
  @IsIn(["m", "f", "o"])
  public gender!: string

  @TestSafe(remove)
  @Column({nullable: true, default: new Date()})
  connectedAt?: Date;

  //@Expose({name: 'gender'})

  get name(): string {
    return this.firstName + " " + this.lastName
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password)
  }

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }
}
