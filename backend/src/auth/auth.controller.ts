import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  OmitType,
} from '@nestjs/swagger';
import { User } from '../users/users.entity';
import { LoginDto } from './dtos/auth.dto';
import { CreateUserDto } from 'src/users/users.dto';
import { AuthService } from './auth.service';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  logger = new Logger();
  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({
    description: 'Logged in successfully',
    type: OmitType(User, ['id', 'name', 'password', 'email'] as const),
  })
  @ApiUnauthorizedResponse({ description: 'Login Failed' })
  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Body(ValidationPipe) loginDto: LoginDto, @Request() req) {
    return {
      status: HttpStatus.OK,
      message: 'Logged in',
      body: req.user,
    };
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
      if (e.code === '23505') {
        this.logger.error(e.message);
        // PostgreSQL duplicate key error code
        throw new HttpException(
          'Invalid signup request',
          HttpStatus.BAD_REQUEST,
        );
      }
      this.logger.error(e.message);
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Return a logged in user' })
  @ApiOkResponse({
    description: 'Found a user successfully',
    type: OmitType(User, ['password'] as const),
  })
  @ApiUnauthorizedResponse({ description: 'Forgot to login' })
  @UseGuards(AuthenticatedGuard)
  @Get('me')
  async findMe(@Request() req) {
    return {
      status: HttpStatus.OK,
      body: req.user,
    };
  }

  @ApiOperation({ summary: 'Logout' })
  @ApiOkResponse({
    description: 'Logout successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Failed to logout' })
  @UseGuards(AuthenticatedGuard)
  @Delete('logout')
  async logout(@Request() req) {
    try {
      req.session.destroy();
      return {
        status: HttpStatus.OK,
        message: 'Logged out successfully',
      };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'JWT Login' })
  @ApiOkResponse({
    description: 'JWT Logged in successfully',
  })
  @ApiUnauthorizedResponse({ description: 'JWT Login Failed' })
  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  @Post('jwt-login')
  jwtLogin(@Body(ValidationPipe) loginDto: LoginDto, @Request() req) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'Return a logged in user with JWT' })
  @ApiOkResponse({
    description: 'Found a user successfully',
    type: OmitType(User, ['password'] as const),
  })
  @ApiUnauthorizedResponse({ description: 'Forgot to login' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('jwt-me')
  async jwtFindMe(@Request() req) {
    return {
      status: HttpStatus.OK,
      body: req.user,
    };
  }
}
