import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Company {
  @PrimaryColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;
  @ApiProperty()
  @Column()
  country: string;
  @ApiProperty()
  @Column()
  foundingDate: Date;
  @ApiProperty()
  @Column()
  description: string;
}
