import {ExecutionContext} from "@nestjs/common";
import camelcase from "camelcase"

export class CrudUtils {
    static async antiAttack() {
        if (process.env.NODE_ENV !== "test") {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
}
