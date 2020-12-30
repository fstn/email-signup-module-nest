import {ConflictException, UnauthorizedException} from "@nestjs/common";

export const UserAlreadyExistsError = new ConflictException("User already exists")
export const InvalidCodeError = new UnauthorizedException("Invalid code")
export const InvalidEmailError = new UnauthorizedException("Invalid email")
