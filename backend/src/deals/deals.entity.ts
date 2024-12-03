import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../companies/companies.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Deal {
  @ApiProperty()
  @PrimaryColumn()
  id: number;

  @ApiProperty()
  @Column()
  date: Date;

  @ApiProperty()
  @Column({ nullable: true })
  fundingAmount: number;

  @ApiProperty()
  @Column()
  fundingRound: string;

  @ApiProperty()
  @ManyToOne(() => Company, (company) => company.deals)
  @JoinColumn()
  company: Company;
}
