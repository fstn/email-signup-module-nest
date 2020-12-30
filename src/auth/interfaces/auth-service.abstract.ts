import {ChangePasswordDto} from "../../email/dtos";
import {AuthCredentialsDto} from "../dtos";
import {User} from "../user.entity";

export abstract class AuthService {
    abstract validateUser(authCredentialsDto: AuthCredentialsDto): Promise<any>;
    abstract login(user: User): Promise<any> ;
    abstract findByEmail(email: string): Promise<any>;
    abstract create(createUserDto: any): Promise<any>;
    abstract changePassword(changePasswordDto: ChangePasswordDto): Promise<any>;
    abstract setUserOnRequest(request: Request): Promise<any>;
}
