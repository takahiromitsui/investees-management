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

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  fundingAmount: number;

  @ApiProperty()
  @Column()
  fundingRound: string;

  @ApiProperty({ type: () => Company })
  @ManyToOne(() => Company, (company) => company.deals)
  @JoinColumn()
  company: Company;
}

@Entity()
export class UpdateDeal {
  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  date: Date;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  fundingAmount: number;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  fundingRound: string;
}

export class CreateDeal {
  @ApiProperty()
  date: string;

  @ApiProperty()
  fundingAmount: number;

  @ApiProperty()
  fundingRound: string;
}
