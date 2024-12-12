import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDateString, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty()
  @MinLength(4)
  @MaxLength(60)
  country: string;

  @ApiProperty()
  @IsDateString()
  foundingDate: Date;

  @ApiProperty()
  @IsString()
  description: string;
}

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}
