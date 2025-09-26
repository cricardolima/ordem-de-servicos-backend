import { Container } from "inversify";
import { TYPES } from "@container/types";
import { IUserLoginUseCase, UserLoginUseCase } from "@use-cases/UserLogin";
import { IUserRepository, UserRepository } from "@repositories/UserRepository";
import { AuthController } from "@controllers/auth.controller";
import { IRefreshTokenRepository, RefreshTokenRepository } from "@repositories/RefreshTokenRepository";
import { IRefreshTokenUseCase, RefreshTokenUseCase } from "@use-cases/RefreshToken";

export class ContainerApp {
    public init(): Container {
        const container = new Container();
        
        // Bind dos Use Cases
        container.bind<IUserLoginUseCase>(TYPES.IUserLoginUseCase).to(UserLoginUseCase);
        container.bind<IRefreshTokenUseCase>(TYPES.IRefreshTokenUseCase).to(RefreshTokenUseCase);
        
        // Bind dos Repositories
        container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
        container.bind<IRefreshTokenRepository>(TYPES.IRefreshTokenRepository).to(RefreshTokenRepository);
        
        // Bind dos Controllers
        container.bind(AuthController).toSelf().inSingletonScope();
        
        return container;
    }
}