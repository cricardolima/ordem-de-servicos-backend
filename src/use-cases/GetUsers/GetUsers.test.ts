import { ContainerApp } from '@container/inversify.config';
import { TYPES } from '@container/types';
import type { IUserRepository } from '@repositories/UserRepository';
import { InMemoryUserRepositoryV2 } from '@tests/repositories/InMemoryUserRepositoryV2';
import { hashPassword } from '@utils/hashPassword';
import type { Container } from 'inversify';
import { GetUsersUseCase } from './GetUsers.use-case';

describe('GetUsersUseCase', () => {
  let testContainer: Container;
  let inMemoryUserRepository: InMemoryUserRepositoryV2;
  let getUsersUseCase: GetUsersUseCase;

  beforeEach(async () => {
    testContainer = new ContainerApp().init();
    testContainer.unbind(TYPES.IUserRepository);

    inMemoryUserRepository = new InMemoryUserRepositoryV2();
    testContainer.bind<IUserRepository>(TYPES.IUserRepository).toConstantValue(inMemoryUserRepository);

    getUsersUseCase = testContainer.get<GetUsersUseCase>(TYPES.IGetUsersUseCase);

    inMemoryUserRepository.createTestUsers(5, {
      registration: '1234567890',
      password: await hashPassword('password123'),
    });
  });

  afterEach(() => {
    inMemoryUserRepository.clear();
  });

  it('should be defined', () => {
    expect(GetUsersUseCase).toBeDefined();
  });

  it('should get users', async () => {
    const users = await getUsersUseCase.execute();

    expect(users).toBeDefined();
    expect(users.length).not.toBe(0);
  });
});
