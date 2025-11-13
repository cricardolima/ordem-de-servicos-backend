import { ContainerApp } from '@container/inversify.config';
import { TYPES } from '@container/types';
import { NotFoundException } from '@exceptions/notFound.exception';
import type { ServicesType } from '@prisma/client';
import type { IServicesTypeRepository } from '@repositories/ServicesTypeRepository';
import { InMemoryServicesTypeRepository } from '@tests/repositories/inMemoryServicesTypeRepository';
import type { Container } from 'inversify';
import { GetServicesTypeByIdUseCase } from './GetServicesTypeById.use-case';

describe('GetServicesTypeByIdUseCase', () => {
  let testContainer: Container;
  let inMemoryServicesTypeRepository: InMemoryServicesTypeRepository;
  let getServicesTypeByIdUseCase: GetServicesTypeByIdUseCase;
  let servicesType: ServicesType;

  beforeEach(() => {
    testContainer = new ContainerApp().init();
    testContainer.unbind(TYPES.IServicesTypeRepository);

    inMemoryServicesTypeRepository = new InMemoryServicesTypeRepository();
    testContainer
      .bind<IServicesTypeRepository>(TYPES.IServicesTypeRepository)
      .toConstantValue(inMemoryServicesTypeRepository);
    getServicesTypeByIdUseCase = testContainer.get<GetServicesTypeByIdUseCase>(TYPES.IGetServicesTypeByIdUseCase);

    servicesType = inMemoryServicesTypeRepository.createTestServicesType({
      serviceName: 'Test Service',
      serviceCode: 'TEST',
    });
  });

  afterEach(() => {
    inMemoryServicesTypeRepository.clear();
  });

  it('should be defined', () => {
    expect(GetServicesTypeByIdUseCase).toBeDefined();
  });

  it('should get a services type by id', async () => {
    const result = await getServicesTypeByIdUseCase.execute(servicesType.id);

    expect(result).toBeDefined();
    expect(result.id).toBe(servicesType.id);
    expect(result.serviceName).toBe(servicesType.serviceName);
    expect(result.serviceCode).toBe(servicesType.serviceCode);
  });

  it('should throw an error if the services type is not found', async () => {
    await expect(getServicesTypeByIdUseCase.execute('123')).rejects.toThrow(NotFoundException);
  });
});
