import {UserAlreadyExistsError} from "../../errors";
import {BaseAuthService} from "../interfaces";
import {BaseFacebookConfiguration} from "../interfaces/base-facebook-configuration";
import {BaseGoogleConfiguration} from "../interfaces/base-google-configuration";
import {UserService} from "./user.service";

let userService: UserService
let authService: BaseAuthService

describe('UserService', () => {
    beforeAll(async (done) => {

        authService = {
            changePassword: jest.fn(),
            create: jest.fn(),
            findByEmail: jest.fn(),
            login: jest.fn(),
            setUserOnRequest: jest.fn(),
            validateUser: jest.fn(),
            canActivate: jest.fn()
        }
        userService = new UserService(authService)

        done();
    })

    it('should throw an exception if user exists', async function () {
        // @ts-ignore
        authService?.findByEmail.mockReturnValue({})
        try {
            await userService.throwErrorIfExists("email")
            fail("Should throw an exception")
        } catch (e) {
            expect(e).toBe(UserAlreadyExistsError)
        }
    });

    it('should not throw an exception if user not exists', async function () {
        // @ts-ignore
        authService?.findByEmail.mockReturnValue(undefined)
        await userService.throwErrorIfExists("email")
    });
})
