import {IsEmail, IsNotEmpty} from "class-validator";

export class CreateEmailDto {
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    firstname!: string;
    lastname!: string
    isFacebook!: boolean;
}
