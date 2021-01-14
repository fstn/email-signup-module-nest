
import {ExecutionContext, Injectable} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {BaseAuthService} from "../interfaces";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private authService: BaseAuthService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result: any = await (super.canActivate(context))
    const request = context.switchToHttp().getRequest();
    await this.authService?.setUserOnRequest?.(request)

    return result
  }

}
