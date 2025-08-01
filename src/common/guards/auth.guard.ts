import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly validPasswords = [
    'admin123', // 普通管理密码
    'wufeng-nodejs-platform', // 特殊密码，可以获取代码内容
  ];

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('缺少授权头');
    }

    const password = authHeader.replace('Bearer ', '');
    
    if (!this.validPasswords.includes(password)) {
      throw new UnauthorizedException('密码错误');
    }

    // 将密码存储在请求中，供后续使用
    request.password = password;
    return true;
  }
}