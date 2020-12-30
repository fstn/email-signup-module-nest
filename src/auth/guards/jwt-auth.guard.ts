
import {ExecutionContext, Injectable} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {AppUserService} from "../interfaces";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private appUserService: AppUserService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result: any = await (super.canActivate(context))
    const request = context.switchToHttp().getRequest();
    await this.appUserService.setUserOnRequest(request)

    return result
  }

}
