import {IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength} from "class-validator";

export class AuthCredentialsDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;
  // noinspection TypeScriptValidateTypes
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(40)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
      {message: 'Password is too weak '})
  password!: string;
}
