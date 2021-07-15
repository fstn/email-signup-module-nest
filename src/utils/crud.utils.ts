
export class CrudUtils {
    static async antiAttack() {
        if (process.env.NODE_ENV !== "test") {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
}
