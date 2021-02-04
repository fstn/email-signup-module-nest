
import {ExecutionContext, Inject, Injectable, InternalServerErrorException} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
      @Inject( "BaseAuthService")
      private readonly authService:any) {
    super();
    if(!authService){
      throw new InternalServerErrorException("BaseAuthService is undefined in JwtAuthGuard")
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let result: any = await (super.canActivate(context))
    const request = context.switchToHttp().getRequest();
    result = result  && this.authService.canActivate(request)
    await this.authService?.setUserOnRequest?.(request)
    return result
  }

}
