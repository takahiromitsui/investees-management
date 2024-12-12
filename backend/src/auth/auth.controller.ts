import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
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
import { CreateUserDto } from 'src/users/users.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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

  @ApiOperation({ summary: 'SignUp' })
  @ApiOkResponse({
    description: 'Singed up successfully',
    type: OmitType(User, ['password'] as const),
  })
  @ApiUnauthorizedResponse({ description: 'SignUp Failed' })
  @ApiBody({ type: CreateUserDto })
  @Post('sign-up')
  async signUp(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    try {
      const user = await this.authService.signUp(createUserDto);
      if (!user) {
        return {
          status: HttpStatus.BAD_REQUEST,
          body: null,
        };
      }
      return {
        status: HttpStatus.OK,
        body: user,
      };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
