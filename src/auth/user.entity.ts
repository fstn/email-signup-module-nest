import {MapToForSnapshot} from "@fstn/typescript-jest-snapshot-mapper";
import {remove} from "@fstn/typescript-jest-snapshot-mapper/dist/utils/mapper";
import * as bcrypt from 'bcrypt'
import {Exclude, Transform} from "class-transformer";

import {IsEmail, IsIn, IsNotEmpty} from "class-validator";
import * as faker from "faker";
import {Column, ManyToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import {Empty, Fake, TestSafe} from "../context";
import {UserUtils} from "../utils/user";
import {UserRole} from "./user-role.entity";

export declare  interface IUser {
  id: string | number
  firstName: string
  lastName: string
  email: string
  password: string
  role: UserRole;
  gender: string
  connectedAt?: Date
  backupConnectedAt?: Date
  rgpd: boolean
  registered: boolean
}

export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  @MapToForSnapshot("dynamic_candidate")(remove)
  id!: string;

  @Fake(faker.name.firstName)
  @Empty((context:any) => context?.firstName)
  @IsNotEmpty()
  @Column({nullable: true})
  firstName!: string;
  //@Expose({name: 'firstName'})

  @Fake(faker.name.lastName)
  @Empty((context:any) => context?.lastName)
  @IsNotEmpty()
  @Column({nullable: true})
  lastName!: string;
  //@Expose({name: 'lastName'})

  @Fake((c:any) => c.email || faker.internet.exampleEmail())
  @Empty((context:any) => context?.email)
  @IsNotEmpty()
  @IsEmail(undefined)
  @Unique(['email'])
  @Column({nullable: true})
  email!: string;
  //@Expose({name: 'email'})

  @Exclude()
  @MapToForSnapshot("dynamic_candidate")(remove)
  @Fake((c:any) => c.password || faker.internet.password(8, true))
  @Empty((c:any) => bcrypt.hashSync(c?.password || faker.internet.password(8, true), 8))
  @Column({nullable: true})
  password!: string
  //@Expose({name: 'password'})

  @ManyToOne(() => UserRole, {cascade: false, eager: true, nullable: true})
  //@Expose({name: 'role'})
  // @ts-ignore
  @Transform(role => role?.name)
  role!: UserRole

  @Fake(faker.random.arrayElement, ["m", "f"])
  @Column({nullable: true})
  @IsIn(["m", "f", "o"])
  gender!: string

  @TestSafe(remove)
  @Column({nullable: true, default: new Date()})
  connectedAt?: Date;

  @TestSafe(remove)
  @Column({nullable: true, default: new Date()})
  backupConnectedAt?: Date;

  @Column({nullable: true})
  rgpd!: boolean

  @Column({nullable: true})
  registered!: boolean

  //@Expose({name: 'gender'})

  get name(): string {
    return this.firstName + " " + this.lastName
  }

  async validatePassword(password: string): Promise<boolean> {
    return UserUtils.validatePassword(this,password)
  }

  hashPassword() {
    return UserUtils.hashPassword(this)
  }
}
