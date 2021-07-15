import {JwtService} from "@nestjs/jwt";
import {EmailService} from "../../email";
import {UserAlreadyExistsError} from "../../errors";
import {BaseAuthService} from "../interfaces";
import {UserService} from "./user.service";

let userService: UserService
let authService: BaseAuthService
let jwtService: JwtService;
let emailService: EmailService

describe('UserService', () => {
    beforeAll(async (done) => {

        authService = {
            changePassword: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findByEmail: jest.fn(),
            login: jest.fn(),
            setUserOnRequest: jest.fn(),
            validateUser: jest.fn(),
            canActivate: jest.fn()
        }
        jwtService = {
            getSecretKey: undefined,
            logger: undefined,
            mergeJwtOptions: undefined,
            options: undefined,
        } as any
        emailService = {} as any
        userService = new UserService(jwtService,authService, emailService)

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
