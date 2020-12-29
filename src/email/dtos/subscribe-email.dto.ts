import {IsAlphanumeric, IsEmail, IsNotEmpty, IsString} from "class-validator";
import {Candidate} from "../../candidate/candidate.entity";

export class SubscribeEmailDto {
  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  firstName: string;
  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  lastName: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string

  constructor(candidate: Candidate, password: string) {
    this.firstName = candidate.firstName;
    this.lastName = candidate.lastName;
    this.email = candidate.email;
    this.password = password
  }
}
