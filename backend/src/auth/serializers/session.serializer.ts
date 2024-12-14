import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '../../users/users.entity';
import { UsersService } from '../../users/users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }
  serializeUser(user: any, done: (err: Error, user: any) => void) {
    done(null, {
      id: user.id,
    });
  }
  async deserializeUser(
    payload: any,
    done: (err: Error, user: Omit<User, 'password'>) => void,
  ) {
    try {
      const user = await this.usersService.findOneById(payload.id);
      if (!user) {
        return done(new Error('User not found'), null);
      }
      const { password, ...rest } = user;
      done(null, rest);
    } catch (err) {
      done(err, null);
    }
  }
}
