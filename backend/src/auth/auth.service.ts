import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/users.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  private readonly logger = new Logger();
  async validate(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    if (!user) {
      this.logger.error(`User not found with email ${username}`);
      throw new NotFoundException('Invalid password or email');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return {
        id: user.id,
      };
    }
    this.logger.error(`User not found with password ${password}`);
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

  async login(user: any) {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
