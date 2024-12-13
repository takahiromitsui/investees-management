import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthenticatedGuard } from './authenticated.guard';
import { SessionSerializer } from './session.serializer';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  providers: [
    AuthService,
    LocalStrategy,
    AuthenticatedGuard,
    SessionSerializer,
    JwtStrategy,
  ],
  controllers: [AuthController],
  imports: [
    UsersModule,
    PassportModule.register({
      session: true,
    }),
    JwtModule.register({
      secret: 'SECRET', // this should obviously be in env for production
      signOptions: { expiresIn: '60s' },
    }),
  ],
  exports: [AuthenticatedGuard],
})
export class AuthModule {}
