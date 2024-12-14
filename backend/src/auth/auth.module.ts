import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { SessionSerializer } from './serializers/session.serializer';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: { expiresIn: '60s' }, // access_token
      }),
    }),
  ],
  exports: [AuthenticatedGuard],
})
export class AuthModule {}
