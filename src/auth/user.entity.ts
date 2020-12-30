import * as bcrypt from 'bcrypt'
import {Exclude, Transform} from "class-transformer";

import {IsEmail, IsIn, IsNotEmpty, IsOptional} from "class-validator";
import * as faker from "faker";
import {BaseEntity, Column, ManyToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import {UserRole} from "./user-role.entity";


export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({nullable: true})
  public firstName!: string;
  //@Expose({name: 'firstName'})

  @Column({nullable: true})
  public lastName!: string;
  //@Expose({name: 'lastName'})

  @IsEmail(undefined)
  @Unique(['email'])
  @Column({nullable: true})
  public email!: string;
  //@Expose({name: 'email'})

  @Exclude()
  @Column({nullable: true})
  public password!: string
  //@Expose({name: 'password'})

  @ManyToOne(() => UserRole, {cascade: false, eager: true, nullable: true})
  //@Expose({name: 'role'})
  @Transform(role => role?.name)
  public role!: UserRole

  @Column({nullable: true})
  @IsIn(["m", "f", "o"])
  public gender!: string

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
