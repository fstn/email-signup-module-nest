
import {ExecutionContext, Inject, Injectable, InternalServerErrorException} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  constructor(
      @Inject( "BaseAuthService")
      private readonly authService:any) {
    super();
    if(!authService){
      throw new InternalServerErrorException("BaseAuthService is undefined in JwtAuthGuard")
    }
  }

  handleRequest(err:any, user:any, info:any, context:any) {
    return user;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let result: any = await (super.canActivate(context))
    const request = context.switchToHttp().getRequest();
    await this.authService?.setUserOnRequest?.(request)
    return true
  }

}
