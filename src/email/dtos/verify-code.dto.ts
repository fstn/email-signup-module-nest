import {IsEmail, IsNotEmpty, IsString, Length} from "class-validator";

export class VerifyCodeDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    @IsString()
    @Length(4, 4)
    code: string;
}
