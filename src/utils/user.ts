import * as bcrypt from "bcrypt";
import {IUser} from "../auth";

export class UserUtils {
    static async hashPassword(user: IUser) {
        user.password = bcrypt.hashSync(user.password, 8);
    }
    static async validatePassword(user: IUser, password: string): Promise<boolean> {
        return bcrypt.compare(password, user.password)
    }
}
