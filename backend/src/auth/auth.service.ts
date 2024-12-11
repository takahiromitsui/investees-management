import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  private readonly logger = new Logger();
  async validate(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    if (user && user.password === password) {
      const { password, ...rest } = user;
      return rest;
    }
    this.logger.error(`User not found with email ${username}`);
    throw new NotFoundException('Invalid password or email');
  }
}
