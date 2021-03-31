import {ChangePasswordDto} from "../../email/dtos";
import {AuthCredentialsDto} from "../dtos";
import {User} from "../user.entity";
import {Request} from "express";

export abstract class BaseAuthService {
    public abstract validateUser(authCredentialsDto: AuthCredentialsDto): Promise<any>;
    public abstract login(user: User): Promise<any> ;
    public abstract findByEmail(email: string): Promise<any>;
    public abstract create(createUserDto: any): Promise<any>;
    public abstract update(updateUserDto: any): Promise<any>;
    public abstract changePassword(changePasswordDto: ChangePasswordDto): Promise<any>;
    public abstract setUserOnRequest(request: Request): Promise<any>;
    public abstract async canActivate(request: Request) : Promise<Boolean>;
}
