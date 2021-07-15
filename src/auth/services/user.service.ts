import {Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {Response} from "express";
import {CreateEmailDto, EmailService} from "../../email";
import {InvalidCodeError, UserAlreadyExistsError} from "../../errors";
import {BaseAuthService} from "../interfaces";

@Injectable()
export class UserService {

    constructor(
        private jwtService: JwtService,
        private readonly authService: BaseAuthService,
        private emailService: EmailService){}

    async throwErrorIfExists(email: string){
        const user = await this.authService?.findByEmail(email )
        if (!!user) {
            throw UserAlreadyExistsError;
        }
    }

    async update(user: any){
        await this.authService?.update(user)
    }

    /**
     * Create auth cookie
     * @param remember
     * @private
     */
    public createCookie(remember: boolean) {
        let cookie = {maxAge: 0, httpOnly: true}
        if (remember) {
            cookie = {
                maxAge: 4 * 30 * 24 * 60 * 60,
                httpOnly: true
            }
        }
        return cookie;
    }

    /**
     * Create Access Token
     * @param createEmailDto
     * @private
     */
    public async createAccessToken(createEmailDto: any) {
        const user = await this.authService.findByEmail(createEmailDto.email)
        if (!user) {
            throw new UnauthorizedException()
        }
        const payload = await this.authService?.login(user);
        const access_token = this.jwtService.sign(payload)
        return {payload, access_token};
    }

    /**
     * SignIn
     * @param user
     * @param remember
     * @param res
     * @private
     */
    public async signIn(user: any, remember: boolean, res: Response) {
        const {payload, access_token} = await this.createAccessToken(user);
        user.backupConnectedAt = user.connectedAt || new Date(0);
        user.connectedAt = new Date();
        await this.update(user)
        let cookie = this.createCookie(remember);
        res.cookie("token", access_token, cookie);
        return res.send({payload, access_token});
    }

    /**
     * Logout
     * @param res
     */
    public logout(res: Response) {
        let cookie = this.createCookie(true);
        res.cookie("token", undefined, cookie);
        return res.send();
    }


}
