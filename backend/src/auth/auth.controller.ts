import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  OmitType,
} from '@nestjs/swagger';
import { User } from '../users/users.entity';
import { LoginDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({
    description: 'Logged in successfully',
    type: OmitType(User, ['password'] as const),
  })
  @ApiUnauthorizedResponse({ description: 'Login Failed' })
  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Body(ValidationPipe) loginDto: LoginDto, @Request() req) {
    return { msg: 'Logged in' };
  }
}
