import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'generated/prisma';
import { ROLES_KEY } from 'src/auth/decorators/roles.decorators';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const session = request.session;

    if (!session?.isAuthenticated || !session?.user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const sessionUserRole = session.user.role;

    const hasRequiredRole = requiredRoles.some(
      (role) => sessionUserRole === role,
    );

    if (!hasRequiredRole) {
      throw new UnauthorizedException(
        `User does not have required role. Required: ${requiredRoles.join(', ')}, Has: ${sessionUserRole}`,
      );
    }

    return hasRequiredRole;
  }
}
