import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {Strategy} from 'passport-local';
import {AuthCredentialsDto} from "./dtos/auth-credentials.dto";
import {BaseAuthService} from "./interfaces/base-auth-service";

@Injectable()
export class UserStrategy extends PassportStrategy(Strategy, "user") {
  constructor(private readonly authService: BaseAuthService) {
    super();
  }

  async validate(email: string, password: string): Promise<any> {
    const authCredentialsDto = new AuthCredentialsDto()
    authCredentialsDto.email = email
    authCredentialsDto.password = password
    const user = await this.authService?.validateUser(authCredentialsDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
