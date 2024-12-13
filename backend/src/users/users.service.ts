import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Equal, Repository } from 'typeorm';
import { CreateUserDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  async findOne(email: string) {
    return await this.repo.findOne({
      where: {
        email: Equal(email),
      },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.repo.create(createUserDto);
    return await this.repo.save(user);
  }

  async findOneById(id: number) {
    return await this.repo.findOne({
      where: {
        id: Equal(id),
      },
    });
  }
}
