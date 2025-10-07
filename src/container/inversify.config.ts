import { Container } from "inversify";
import { TYPES } from "@container/types";
import { IUserLoginUseCase, UserLoginUseCase } from "@use-cases/UserLogin";
import { IUserRepository, UserRepository } from "@repositories/UserRepository";
import { AuthController, UserController } from "@controllers/index";
import { IRefreshTokenRepository, RefreshTokenRepository } from "@repositories/RefreshTokenRepository";
import { IRefreshTokenUseCase, RefreshTokenUseCase } from "@use-cases/RefreshToken";
import { IGetUsersUseCase, GetUsersUseCase } from "@use-cases/GetUsers";
import { ICreateUserUseCase, CreateUserUseCase } from "@use-cases/CreateUser";
import { IUpdateUserUseCase, UpdateUserUseCase } from "@use-cases/UpdateUser";
import { IDeleteUserUseCase, DeleteUserUseCase } from "@use-cases/DeleteUser";

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
        // Bind dos Repositories
        container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
        container.bind<IRefreshTokenRepository>(TYPES.IRefreshTokenRepository).to(RefreshTokenRepository);
        
        // Bind dos Controllers
        container.bind(AuthController).toSelf().inSingletonScope();
        container.bind(UserController).toSelf().inSingletonScope();
        return container;
    }
}