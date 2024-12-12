import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthenticatedGuard } from './authenticated.guard';
import { SessionSerializer } from './session.serializer';

@Module({
  providers: [
    AuthService,
    LocalStrategy,
    AuthenticatedGuard,
    SessionSerializer,
  ],
  controllers: [AuthController],
  imports: [
    UsersModule,
    PassportModule.register({
      session: true,
    }),
  ],
  exports: [AuthenticatedGuard],
})
export class AuthModule {}
