import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  OmitType,
} from '@nestjs/swagger';
import { User } from '../users/users.entity';
import { ValidateUserDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({
    description: 'Logged in successfully',
    type: OmitType(User, ['password'] as const),
  })
  @ApiUnauthorizedResponse({ description: 'Login Failed' })
  @ApiBody({ type: ValidateUserDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    return req.user;
  }
}
