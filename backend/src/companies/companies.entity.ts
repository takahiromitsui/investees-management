import { ApiProperty } from '@nestjs/swagger';
import { Deal } from '../deals/deals.entity';
import { Column, Entity, JoinTable, OneToMany, PrimaryColumn } from 'typeorm';

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

  @ApiProperty()
  @OneToMany(() => Deal, (deal) => deal.company, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  deals: Deal[];
}

@Entity()
export class UpdateCompany {
  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  name: string;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  country: string;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  foundingDate: Date;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  description: string;
}
