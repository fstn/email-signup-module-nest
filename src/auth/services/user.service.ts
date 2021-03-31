import {Injectable} from '@nestjs/common';
import {UserAlreadyExistsError} from "../../errors";
import {BaseAuthService} from "../interfaces";
import {IUser} from "../user.entity";

@Injectable()
export class UserService {

    constructor(
        private readonly authService: BaseAuthService){}

    async throwErrorIfExists(email: string){
        const user = await this.authService?.findByEmail(email )
        if (!!user) {
            throw UserAlreadyExistsError;
        }
    }

    async update(user: any){
        await this.authService?.update(user)
    }
}
