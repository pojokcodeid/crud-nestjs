import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new HttpException(
        {
          message: ['Token not found'],
          error: 'Unauthorized',
          statusCode: 401,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    try {
      const payload: { sub: number; email: string } =
        await this.jwtService.verifyAsync(token, {
          secret: jwtConstants.secret,
        });
      request['user'] = payload;
    } catch {
      throw new HttpException(
        {
          message: ['Invalid token'],
          error: 'Unauthorized',
          statusCode: 401,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return true;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers['authorization'] as string | undefined;
    if (!authHeader) {
      return undefined;
    }
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
