import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  username: string;

  @ApiProperty()
  @MinLength(8)
  @MaxLength(40)
  password: string;
}
