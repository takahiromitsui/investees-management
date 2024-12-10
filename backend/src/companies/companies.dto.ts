import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDateString, IsString, MaxLength, MinLength } from 'class-validator';
import { Column, Entity } from 'typeorm';

export class CreateCompanyDto {
  @ApiProperty()
  @Column()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty()
  @Column()
  @MinLength(4)
  @MaxLength(60)
  country: string;

  @ApiProperty()
  @Column()
  @IsDateString()
  foundingDate: Date;

  @ApiProperty()
  @Column()
  @IsString()
  description: string;
}

@Entity()
export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}
