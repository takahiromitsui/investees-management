import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { Column } from 'typeorm';

export class ValidateUserDto {
  @ApiProperty()
  @Column()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Column()
  @MinLength(8)
  @MaxLength(60)
  password: string;
}
