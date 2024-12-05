import { ApiProperty } from '@nestjs/swagger';

export class SearchDto {
  @ApiProperty({ nullable: true })
  search?: string;
}
