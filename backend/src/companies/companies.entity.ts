import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Company {
  @ApiProperty()
  @PrimaryColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;
  @ApiProperty()
  @Column({ nullable: true })
  country: string;
  @ApiProperty()
  @Column()
  foundingDate: Date;
  @ApiProperty()
  @Column({ nullable: true })
  description: string;
}
