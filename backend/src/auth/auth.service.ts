import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ValidateUserDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  private readonly logger = new Logger();
  async validate(validateUserDto: ValidateUserDto) {
    const user = await this.usersService.findOne(validateUserDto.email);
    if (!user) {
      this.logger.error(`User not found with email ${validateUserDto.email}`);
      throw new NotFoundException('Invalid password or email');
    }
    const { password, ...rest } = user;
    this.logger.log(rest);
    return rest;
  }
}
