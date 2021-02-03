import {IsEmail, IsNotEmpty, IsString, Length, MinLength} from "class-validator";

export class ChangePasswordDto {
    @IsNotEmpty()
    @IsEmail()
    email!: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(10)
    password!: string;
    @IsNotEmpty()
    @IsString()
    @Length(4, 4)
    code!: string;
}

