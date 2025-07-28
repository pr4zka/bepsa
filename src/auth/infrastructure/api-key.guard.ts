import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { API_KEY } from '../../config/contans';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();
    const key = req.headers['x-api-key'];
    if (key !== API_KEY) throw new UnauthorizedException('API Key inválida');
    return true;
  }
}
