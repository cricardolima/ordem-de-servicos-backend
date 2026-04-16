import type { ICreateClientRequest } from '@dtos/models';
import { Role, type User } from '@prisma/client';
import { hash } from 'bcrypt';
import type { Express } from 'express';
import type { Container } from 'inversify';
import request from 'supertest';
import { App } from '../../src/app';
import { InMemoryClientAddressRepository } from '../repositories/InMemoryClientAddressRepository';
import { InMemoryClientsRepository } from '../repositories/InMemoryClientsRepository';
import { InMemoryRefreshTokenRepository } from '../repositories/InMemoryRefreshTokenRepository';
import { InMemoryUserRepositoryV2 } from '../repositories/InMemoryUserRepositoryV2';
import { setupTestContainer } from '../utils/setupTestContainer';

describe('ClientsController', () => {
  let app: Express;
  let testContainer: Container;
  let inMemoryClientsRepository: InMemoryClientsRepository;
  let inMemoryClientAddressRepository: InMemoryClientAddressRepository;
  let inMemoryUserRepository: InMemoryUserRepositoryV2;
  let inMemoryRefreshTokenRepository: InMemoryRefreshTokenRepository;
  let accessToken: string;

  const clientPayload: ICreateClientRequest = {
    name: 'Client Test',
    phone: '11999999999',
    address: [
      {
        street: 'Rua Teste',
        number: '123',
        complement: 'Sala 1',
        neighborhood: 'Centro',
        zipCode: '01000-000',
      },
    ],
  };

  async function createUser(overrides: Partial<User> = {}) {
    const defaultUser = {
      name: 'Test User',
      registration: 'admin',
      password: await hash('admin', 10),
      role: Role.ADMIN,
      ...overrides,
    };

    return inMemoryUserRepository.createTestUser(defaultUser);
  }

  beforeAll(async () => {
    inMemoryClientsRepository = new InMemoryClientsRepository();
    inMemoryClientAddressRepository = new InMemoryClientAddressRepository();
    inMemoryUserRepository = new InMemoryUserRepositoryV2();
    inMemoryRefreshTokenRepository = new InMemoryRefreshTokenRepository();

    testContainer = setupTestContainer({
      IClientsRepository: inMemoryClientsRepository,
      IClientAddressRepository: inMemoryClientAddressRepository,
      IUserRepository: inMemoryUserRepository,
      IRefreshTokenRepository: inMemoryRefreshTokenRepository,
    });

    const appInstance = new App(testContainer);
    app = appInstance.build();

    await createUser();

    const loginResponse = await request(app).post('/auth/login').send({
      registration: 'admin',
      password: 'admin',
    });

    accessToken = loginResponse.body.accessToken;
  });

  afterAll(() => {
    inMemoryClientsRepository.clear();
    inMemoryClientAddressRepository.clear();
    inMemoryUserRepository.clear();
    inMemoryRefreshTokenRepository.clear();
    jest.clearAllMocks();
  });

  describe('POST /clients', () => {
    it('should return 201 and create a client with addresses', async () => {
      const response = await request(app)
        .post('/clients')
        .set({
          Authorization: `Bearer ${accessToken}`,
        })
        .send(clientPayload);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: clientPayload.name,
          phone: clientPayload.phone,
          clientAddress: [
            expect.objectContaining({
              street: 'Rua Teste',
              number: '123',
              neighborhood: 'Centro',
              zipCode: '01000-000',
            }),
          ],
        }),
      );
    });

    it('should return 400 when the client already exists', async () => {
      await inMemoryClientsRepository.create({
        name: 'Existing Client',
        phone: '11888888888',
        address: [],
      });

      const response = await request(app)
        .post('/clients')
        .set({
          Authorization: `Bearer ${accessToken}`,
        })
        .send({
          ...clientPayload,
          phone: '11888888888',
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: {
          message: 'Client already exists',
          type: 'business_error',
        },
      });
    });

    it('should return 401 when no token is provided', async () => {
      const response = await request(app).post('/clients').send(clientPayload);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        success: false,
        error: {
          message: 'Token not found',
          type: 'unauthorized_error',
        },
      });
    });
  });

  describe('GET /clients/:id', () => {
    it('should return 200 and get a client by id', async () => {
      const client = await inMemoryClientsRepository.create({
        name: 'Get Client',
        phone: '11777777777',
        address: clientPayload.address,
      });

      const response = await request(app)
        .get(`/clients/${client.id}`)
        .set({
          Authorization: `Bearer ${accessToken}`,
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: client.id,
          name: 'Get Client',
          phone: '11777777777',
          clientAddress: [
            expect.objectContaining({
              street: 'Rua Teste',
              number: '123',
            }),
          ],
        }),
      );
    });

    it('should return 401 when no token is provided', async () => {
      const client = await inMemoryClientsRepository.create({
        name: 'Unauthenticated Client',
        phone: '11666666666',
        address: [],
      });

      const response = await request(app).get(`/clients/${client.id}`);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        success: false,
        error: {
          message: 'Token not found',
          type: 'unauthorized_error',
        },
      });
    });
  });

  describe('DELETE /clients/:id', () => {
    it('should return 200 and 404 after deleting a client', async () => {
      const client = await inMemoryClientsRepository.create({
        name: 'Delete Client',
        phone: '11555555555',
        address: [],
      });

      const deleteResponse = await request(app)
        .delete(`/clients/${client.id}`)
        .set({
          Authorization: `Bearer ${accessToken}`,
        });

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toEqual({
        success: true,
        message: 'Client deleted successfully',
      });

      const getResponse = await request(app)
        .get(`/clients/${client.id}`)
        .set({
          Authorization: `Bearer ${accessToken}`,
        });

      expect(getResponse.status).toBe(404);
      expect(getResponse.body).toEqual({
        success: false,
        error: {
          message: 'Client not found',
          type: 'not_found_error',
        },
      });
    });

    it('should return 401 when no token is provided', async () => {
      const client = await inMemoryClientsRepository.create({
        name: 'Delete Unauthenticated',
        phone: '11444444444',
        address: [],
      });

      const response = await request(app).delete(`/clients/${client.id}`);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        success: false,
        error: {
          message: 'Token not found',
          type: 'unauthorized_error',
        },
      });
    });
  });
});
