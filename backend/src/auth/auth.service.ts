import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/users.dto';
import * as bcrypt from 'bcrypt';
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

  async signUp(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;
    const hash = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      ...rest,
      password: hash,
    });
    if (user) {
      const { password, ...rest } = user;
      this.logger.log('Succeeded to create a user');
      return rest;
    }
    this.logger.error('Failed to create a user');
  }
}
