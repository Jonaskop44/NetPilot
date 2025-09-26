import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async handleMicrosoftLogin(profile: any) {
    const { oid, displayName, emails } = profile;
    let user = await this.userService.findByProviderId(oid);

    if (!user) {
      user = await this.userService.createUser(profile);
    }
    return user;
  }
}
