import { TYPES } from '@container/types';
import {
  AuthController,
  ClientsController,
  ProfessionalsController,
  ServicesTypeController,
  UserController,
} from '@controllers/index';
import { ClientAddressRepository, type IClientAddressRepository } from '@repositories/ClientAddressRepository';
import { ClientsRepository, type IClientsRepository } from '@repositories/ClientsRepository';
import { type IProfessionalsRepository, ProfessionalsRepository } from '@repositories/ProfessionalsRepository';
import { type IRefreshTokenRepository, RefreshTokenRepository } from '@repositories/RefreshTokenRepository';
import { type IServicesTypeRepository, ServicesTypeRepository } from '@repositories/ServicesTypeRepository';
import { type IUserRepository, UserRepository } from '@repositories/UserRepository';
import { CreateClientUseCase, type ICreateClientUseCase } from '@use-cases/CreateClient';
import { CreateProfessionalsUseCase, type ICreateProfessionalsUseCase } from '@use-cases/CreateProfessionals';
import { CreateServicesTypeUseCase, type ICreateServicesTypeUseCase } from '@use-cases/CreateServicesType';
import { CreateUserUseCase, type ICreateUserUseCase } from '@use-cases/CreateUser';
import { DeleteClientUseCase, type IDeleteClientUseCase } from '@use-cases/DeleteClient';
import { DeleteProfessionalUseCase, type IDeleteProfessionalUseCase } from '@use-cases/DeleteProfessional';
import { DeleteServiceTypeUseCase, type IDeleteServiceTypeUseCase } from '@use-cases/DeleteServiceType';
import { DeleteUserUseCase, type IDeleteUserUseCase } from '@use-cases/DeleteUser';
import { GetClientByIdUseCase, type IGetClientByIdUseCase } from '@use-cases/GetClientById';
import { GetProfessionalByIdUseCase, type IGetProfessionalByIdUseCase } from '@use-cases/GetProfessionalById';
import { GetProfessionalsUseCase, type IGetProfessionalsUseCase } from '@use-cases/GetProfessionals';
import { GetServicesTypeUseCase, type IGetServicesTypeUseCase } from '@use-cases/GetServicesType';
import { GetServicesTypeByIdUseCase, type IGetServicesTypeByIdUseCase } from '@use-cases/GetServicesTypeById';
import { GetUserByIdUseCase, type IGetUserByIdUseCase } from '@use-cases/GetUserById';
import { GetUsersUseCase, type IGetUsersUseCase } from '@use-cases/GetUsers';
import { type IRefreshTokenUseCase, RefreshTokenUseCase } from '@use-cases/RefreshToken';
import { type IUpdateProfessionalUseCase, UpdateProfessionalUseCase } from '@use-cases/UpdateProfessional';
import { type IUpdateServicesTypeUseCase, UpdateServicesTypeUseCase } from '@use-cases/UpdateServicesType';
import { type IUpdateUserUseCase, UpdateUserUseCase } from '@use-cases/UpdateUser';
import { type IUserLoginUseCase, UserLoginUseCase } from '@use-cases/UserLogin';
import { Container } from 'inversify';

export class ContainerApp {
  public init(): Container {
    const container = new Container();

    // Bind dos Use Cases
    container.bind<IUserLoginUseCase>(TYPES.IUserLoginUseCase).to(UserLoginUseCase);
    container.bind<IRefreshTokenUseCase>(TYPES.IRefreshTokenUseCase).to(RefreshTokenUseCase);
    container.bind<IGetUsersUseCase>(TYPES.IGetUsersUseCase).to(GetUsersUseCase);
    container.bind<ICreateUserUseCase>(TYPES.ICreateUserUseCase).to(CreateUserUseCase);
    container.bind<IUpdateUserUseCase>(TYPES.IUpdateUserUseCase).to(UpdateUserUseCase);
    container.bind<IDeleteUserUseCase>(TYPES.IDeleteUserUseCase).to(DeleteUserUseCase);
    container.bind<IGetUserByIdUseCase>(TYPES.IGetUserByIdUseCase).to(GetUserByIdUseCase);
    container.bind<IGetServicesTypeUseCase>(TYPES.IGetServicesTypeUseCase).to(GetServicesTypeUseCase);
    container.bind<ICreateServicesTypeUseCase>(TYPES.ICreateServicesTypeUseCase).to(CreateServicesTypeUseCase);
    container.bind<IDeleteServiceTypeUseCase>(TYPES.IDeleteServiceTypeUseCase).to(DeleteServiceTypeUseCase);
    container.bind<IUpdateServicesTypeUseCase>(TYPES.IUpdateServicesTypeUseCase).to(UpdateServicesTypeUseCase);
    container.bind<IGetServicesTypeByIdUseCase>(TYPES.IGetServicesTypeByIdUseCase).to(GetServicesTypeByIdUseCase);
    container.bind<ICreateProfessionalsUseCase>(TYPES.ICreateProfessionalsUseCase).to(CreateProfessionalsUseCase);
    container.bind<IGetProfessionalByIdUseCase>(TYPES.IGetProfessionalByIdUseCase).to(GetProfessionalByIdUseCase);
    container.bind<IGetProfessionalsUseCase>(TYPES.IGetProfessionalsUseCase).to(GetProfessionalsUseCase);
    container.bind<IUpdateProfessionalUseCase>(TYPES.IUpdateProfessionalUseCase).to(UpdateProfessionalUseCase);
    container.bind<IDeleteProfessionalUseCase>(TYPES.IDeleteProfessionalUseCase).to(DeleteProfessionalUseCase);
    container.bind<ICreateClientUseCase>(TYPES.ICreateClientUseCase).to(CreateClientUseCase);
    container.bind<IGetClientByIdUseCase>(TYPES.IGetClientByIdUseCase).to(GetClientByIdUseCase);
	container.bind<IDeleteClientUseCase>(TYPES.IDeleteClientUseCase).to(DeleteClientUseCase);
    // Bind dos Repositories
    container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
    container.bind<IRefreshTokenRepository>(TYPES.IRefreshTokenRepository).to(RefreshTokenRepository);
    container.bind<IServicesTypeRepository>(TYPES.IServicesTypeRepository).to(ServicesTypeRepository);
    container.bind<IProfessionalsRepository>(TYPES.IProfessionalsRepository).to(ProfessionalsRepository);
    container.bind<IClientsRepository>(TYPES.IClientsRepository).to(ClientsRepository);
    container.bind<IClientAddressRepository>(TYPES.IClientAddressRepository).to(ClientAddressRepository);
    // Bind dos Controllers
    container.bind(AuthController).toSelf().inSingletonScope();
    container.bind(UserController).toSelf().inSingletonScope();
    container.bind(ServicesTypeController).toSelf().inSingletonScope();
    container.bind(ProfessionalsController).toSelf().inSingletonScope();
    container.bind(ClientsController).toSelf().inSingletonScope();

    return container;
  }
}
