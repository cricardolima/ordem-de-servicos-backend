import { Role, type User } from '@prisma/client';
import { hash } from 'bcrypt';
import type { InMemoryUserRepositoryV2 } from '../repositories/InMemoryUserRepositoryV2';

async function createUser(inMemoryUserRepository: InMemoryUserRepositoryV2, overrides: Partial<User> = {}) {
  const defaultUser = {
    name: 'Test User',
    registration: 'admin',
    password: await hash('admin', 10),
    role: Role.ADMIN,
    ...overrides,
  };
  return inMemoryUserRepository.createTestUser(defaultUser);
}

export default createUser;
