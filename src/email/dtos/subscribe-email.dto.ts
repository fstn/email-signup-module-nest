import {IsAlphanumeric, IsEmail, IsNotEmpty, IsString} from "class-validator";

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

  constructor(user: any, password: string) {
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.password = password
  }
}
