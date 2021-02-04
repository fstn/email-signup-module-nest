import {IsEmail, IsNotEmpty, IsString, Length, MinLength} from "class-validator";

export class PreLoginDto {
    @IsNotEmpty()
    @IsEmail()
    email!: string;
}

