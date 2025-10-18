import { Container } from "inversify";
import { TYPES } from "@container/types";
import { IUserLoginUseCase, UserLoginUseCase } from "@use-cases/UserLogin";
import { IUserRepository, UserRepository } from "@repositories/UserRepository";
import { AuthController, UserController, ServicesTypeController, ProfessionalsController } from "@controllers/index";
import { IRefreshTokenRepository, RefreshTokenRepository } from "@repositories/RefreshTokenRepository";
import { IRefreshTokenUseCase, RefreshTokenUseCase } from "@use-cases/RefreshToken";
import { IGetUsersUseCase, GetUsersUseCase } from "@use-cases/GetUsers";
import { ICreateUserUseCase, CreateUserUseCase } from "@use-cases/CreateUser";
import { IUpdateUserUseCase, UpdateUserUseCase } from "@use-cases/UpdateUser";
import { IDeleteUserUseCase, DeleteUserUseCase } from "@use-cases/DeleteUser";
import { IGetUserByIdUseCase, GetUserByIdUseCase } from "@use-cases/GetUserById";
import { IServicesTypeRepository, ServicesTypeRepository } from "@repositories/ServicesTypeRepository";
import { IGetServicesTypeUseCase, GetServicesTypeUseCase } from "@use-cases/GetServicesType";
import { ICreateServicesTypeUseCase, CreateServicesTypeUseCase } from "@use-cases/CreateServicesType";
import { IDeleteServiceTypeUseCase, DeleteServiceTypeUseCase } from "@use-cases/DeleteServiceType";
import { IUpdateServicesTypeUseCase, UpdateServicesTypeUseCase } from "@use-cases/UpdateServicesType";
import { IGetServicesTypeByIdUseCase, GetServicesTypeByIdUseCase } from "@use-cases/GetServicesTypeById";
import { IProfessionalsRepository, ProfessionalsRepository } from "@repositories/ProfessionalsRepository";
import { ICreateProfessionalsUseCase, CreateProfessionalsUseCase } from "@use-cases/CreateProfessionals";

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

        // Bind dos Repositories
        container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
        container.bind<IRefreshTokenRepository>(TYPES.IRefreshTokenRepository).to(RefreshTokenRepository);
        container.bind<IServicesTypeRepository>(TYPES.IServicesTypeRepository).to(ServicesTypeRepository);
        container.bind<IProfessionalsRepository>(TYPES.IProfessionalsRepository).to(ProfessionalsRepository);

        // Bind dos Controllers
        container.bind(AuthController).toSelf().inSingletonScope();
        container.bind(UserController).toSelf().inSingletonScope();
        container.bind(ServicesTypeController).toSelf().inSingletonScope();
        container.bind(ProfessionalsController).toSelf().inSingletonScope();
        
        return container;
    }
}