import { Container } from "inversify";
import { TYPES } from "@container/types";
import { IUserLoginUseCase, UserLoginUseCase } from "@use-cases/UserLogin";
import { IUserRepository, UserRepository } from "@repositories/UserRepository";
import { AuthController, UserController, ServicesTypeController } from "@controllers/index";
import { IRefreshTokenRepository, RefreshTokenRepository } from "@repositories/RefreshTokenRepository";
import { IRefreshTokenUseCase, RefreshTokenUseCase } from "@use-cases/RefreshToken";
import { IGetUsersUseCase, GetUsersUseCase } from "@use-cases/GetUsers";
import { ICreateUserUseCase, CreateUserUseCase } from "@use-cases/CreateUser";
import { IUpdateUserUseCase, UpdateUserUseCase } from "@use-cases/UpdateUser";
import { IDeleteUserUseCase, DeleteUserUseCase } from "@use-cases/DeleteUser";
import { IGetUserByIdUseCase, GetUserByIdUseCase } from "@use-cases/GetUserById";
import { IServicesTypeRepository, ServicesTypeRepository } from "@repositories/ServicesTypeRepository";
import { IGetServicesTypeUseCase, GetServicesTypeUseCase } from "@use-cases/GetServicesType";

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
        // Bind dos Repositories
        container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
        container.bind<IRefreshTokenRepository>(TYPES.IRefreshTokenRepository).to(RefreshTokenRepository);
        container.bind<IServicesTypeRepository>(TYPES.IServicesTypeRepository).to(ServicesTypeRepository);
        // Bind dos Controllers
        container.bind(AuthController).toSelf().inSingletonScope();
        container.bind(UserController).toSelf().inSingletonScope();
        container.bind(ServicesTypeController).toSelf().inSingletonScope();
        return container;
    }
}