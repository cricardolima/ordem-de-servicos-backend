import { ContainerApp } from '@container/inversify.config';
import { TYPES } from '@container/types';
import type { User } from '@prisma/client';
import type { IRefreshTokenRepository } from '@repositories/RefreshTokenRepository';
import type { IUserRepository } from '@repositories/UserRepository';
import { InMemoryRefreshTokenRepository } from '@tests/repositories/InMemoryRefreshTokenRepository';
import { InMemoryUserRepositoryV2 } from '@tests/repositories/InMemoryUserRepositoryV2';
import dayjs from 'dayjs';
import type { Container } from 'inversify';
import { DeleteUserUseCase } from './DeleteUser.use-case';

describe('DeleteUserUseCase', () => {
  let testContainer: Container;
  let inMemoryUserRepository: InMemoryUserRepositoryV2;
  let deleteUserUseCase: DeleteUserUseCase;
  let inMemoryRefreshTokenRepository: InMemoryRefreshTokenRepository;
  let user: User;

  beforeEach(async () => {
    testContainer = new ContainerApp().init();
    testContainer.unbind(TYPES.IUserRepository);
    testContainer.unbind(TYPES.IRefreshTokenRepository);

    inMemoryUserRepository = new InMemoryUserRepositoryV2();
    testContainer.bind<IUserRepository>(TYPES.IUserRepository).toConstantValue(inMemoryUserRepository);
    inMemoryRefreshTokenRepository = new InMemoryRefreshTokenRepository();
    testContainer
      .bind<IRefreshTokenRepository>(TYPES.IRefreshTokenRepository)
      .toConstantValue(inMemoryRefreshTokenRepository);
    deleteUserUseCase = testContainer.get<DeleteUserUseCase>(TYPES.IDeleteUserUseCase);

    user = inMemoryUserRepository.createTestUser();

    inMemoryRefreshTokenRepository.create({
      token: 'test-token',
      userId: user.id,
      expiresAt: dayjs().add(1, 'day').unix().toString(),
    });
  });

  afterEach(() => {
    inMemoryUserRepository.clear();
    inMemoryRefreshTokenRepository.clear();
  });

  it('should be defined', () => {
    expect(DeleteUserUseCase).toBeDefined();
  });

  it('should delete a user', async () => {
    await deleteUserUseCase.execute(user.id);
    const deletedUser = await inMemoryUserRepository.findByIdAndDeletedAtNull(user.id);
    expect(deletedUser).toBeNull();

    const refreshToken = await inMemoryRefreshTokenRepository.findByToken(user.id);
    expect(refreshToken).toBeNull();
  });

  it('should throw an error if the user does not exist', async () => {
    await expect(deleteUserUseCase.execute('non-existent-user-id')).rejects.toThrow('User not found');
  });
});
