import { Injectable, NotFoundException } from '@nestjs/common';
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
  async validate(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new NotFoundException('Invalid password or email');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return {
        id: user.id,
      };
    }
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
      return rest;
    }
  }
  // JWT strategy
  async login(user: any) {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
