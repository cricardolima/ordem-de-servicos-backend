import { ContainerApp } from '@container/inversify.config';
import { TYPES } from '@container/types';
import type { ICreateProfessionalsRequest } from '@dtos/models';
import type { Professionals } from '@prisma/client';
import type { IProfessionalsRepository } from '@repositories/ProfessionalsRepository';
import { InMemoryProfessionalsRepository } from '@tests/repositories/InMemoryProfessionalsRepository';
import type { Container } from 'inversify';
import { GetProfessionalByIdUseCase } from './GetProfessionalById.use-case';

describe('GetProfessionalByIdUseCase', () => {
  let testContainer: Container;
  let inMemoryProfessionalsRepository: InMemoryProfessionalsRepository;
  let getProfessionalByIdUseCase: GetProfessionalByIdUseCase;
  let professional: Professionals;

  beforeAll(async () => {
    testContainer = new ContainerApp().init();
    inMemoryProfessionalsRepository = new InMemoryProfessionalsRepository();

    testContainer.unbind(TYPES.IProfessionalsRepository);
    testContainer
      .bind<IProfessionalsRepository>(TYPES.IProfessionalsRepository)
      .toConstantValue(inMemoryProfessionalsRepository);
    getProfessionalByIdUseCase = testContainer.get<GetProfessionalByIdUseCase>(TYPES.IGetProfessionalByIdUseCase);

    professional = await inMemoryProfessionalsRepository.create({
      name: 'Test Professional',
      registration: '1234567890',
    } as ICreateProfessionalsRequest);
  });

  afterAll(() => {
    inMemoryProfessionalsRepository.clear();
    testContainer.unbindAll();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(GetProfessionalByIdUseCase).toBeDefined();
  });

  it('should get a professional by id', async () => {
    const result = await getProfessionalByIdUseCase.execute(professional.id);

    expect(result).toBeDefined();
    expect(result.id).toBe(professional.id);
    expect(result.name).toBe(professional.name);
    expect(result.registration).toBe(professional.registration);
  });

  it('should throw a NotFoundException if the professional does not exist', async () => {
    await expect(getProfessionalByIdUseCase.execute('non-existent-professional-id')).rejects.toThrow(
      'Professional not found',
    );
  });
});
