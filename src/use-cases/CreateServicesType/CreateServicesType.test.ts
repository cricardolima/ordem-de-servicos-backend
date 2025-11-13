import { ContainerApp } from '@container/inversify.config';
import { TYPES } from '@container/types';
import type { ICreateServicesTypeRequest } from '@dtos/models';
import { BusinessException } from '@exceptions/business.exception';
import type { IServicesTypeRepository } from '@repositories/ServicesTypeRepository';
import { InMemoryServicesTypeRepository } from '@tests/repositories/inMemoryServicesTypeRepository';
import type { Container } from 'inversify';
import { CreateServicesTypeUseCase } from './CreateServicesType.use-case';

describe('CreateServicesTypeUseCase', () => {
  let testContainer: Container;
  let createServicesTypeUseCase: CreateServicesTypeUseCase;
  let inMemoryServicesTypeRepository: InMemoryServicesTypeRepository;

  beforeEach(async () => {
    testContainer = new ContainerApp().init();
    testContainer.unbind(TYPES.IServicesTypeRepository);

    inMemoryServicesTypeRepository = new InMemoryServicesTypeRepository();
    testContainer
      .bind<IServicesTypeRepository>(TYPES.IServicesTypeRepository)
      .toConstantValue(inMemoryServicesTypeRepository);
    createServicesTypeUseCase = testContainer.get<CreateServicesTypeUseCase>(TYPES.ICreateServicesTypeUseCase);

    inMemoryServicesTypeRepository.createTestServicesType({
      serviceName: 'Test Service',
      serviceCode: 'TEST',
    });
  });

  it('should be defined', () => {
    expect(CreateServicesTypeUseCase).toBeDefined();
  });

  it('should create a services type', async () => {
    const servicesType: ICreateServicesTypeRequest = {
      serviceName: 'Test Service',
      serviceCode: 'TEST02',
    };

    const result = await createServicesTypeUseCase.execute(servicesType);

    expect(result).toBeDefined();
    expect(result.serviceName).toBe(servicesType.serviceName);
    expect(result.serviceCode).toBe(servicesType.serviceCode);
  });

  it('should throw a BusinessException if the services type already exists', async () => {
    const servicesType: ICreateServicesTypeRequest = {
      serviceName: 'Test Service',
      serviceCode: 'TEST',
    };

    await expect(createServicesTypeUseCase.execute(servicesType)).rejects.toThrow(BusinessException);
  });
});
