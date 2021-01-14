import {Injectable} from '@nestjs/common';
import {UserAlreadyExistsError} from "../../errors";
import {BaseAuthService} from "../interfaces";

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
}
