import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersService', () => {
  const mockUsers = [
    {
      id: 1,
      name: 'Jane Doe',
      email: 'janedoe@mail.com',
      password: 'password',
    },
    {
      id: 2,
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: 'password',
    },
  ] as User[];

  let service: UsersService;

  const mockUsersRepo = {
    findOne: jest.fn(({ where: { email } }) =>
      Promise.resolve(mockUsers.find((user) => user.email === email)),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should return one user', async () => {
    const user = await service.findOne('janedoe@mail.com');
    expect(user).toEqual(mockUsers[0]);
  });
});
