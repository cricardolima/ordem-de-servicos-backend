import { UserLoginUseCase } from "./UserLogin.use-case";
import { InMemoryUserRepositoryV2 } from "@tests/repositories/InMemoryUserRepositoryV2";
import { ContainerApp } from "@container/inversify.config";
import { Container } from "inversify";
import { TYPES } from "@container/types";
import { IUserRepository } from "@repositories/UserRepository/index";
import { IRefreshTokenRepository } from "@repositories/RefreshTokenRepository/index";
import { InMemoryRefreshTokenRepository } from "@tests/repositories/InMemoryRefreshTokenRepository";
import { IUserLoginRequest } from "@dtos/models";
import { hash } from "bcrypt";
import { NotFoundException } from "@exceptions/notFound.exception";
import { BusinessException } from "@exceptions/business.exception";

describe('UserLoginUseCase', () => {
    const saltRounds = Number(process.env.SALT_ROUNDS);
    let testContainer: Container;
    let inMemoryUserRepository: InMemoryUserRepositoryV2;
    let userLoginUseCase: UserLoginUseCase;

    beforeEach(async () => {
        testContainer = new ContainerApp().init();
        testContainer.unbind(TYPES.IUserRepository);
        testContainer.unbind(TYPES.IRefreshTokenRepository);

        inMemoryUserRepository = new InMemoryUserRepositoryV2();
        testContainer.bind<IUserRepository>(TYPES.IUserRepository).toConstantValue(inMemoryUserRepository);
        testContainer.bind<IRefreshTokenRepository>(TYPES.IRefreshTokenRepository).toConstantValue(new InMemoryRefreshTokenRepository());
        userLoginUseCase = testContainer.get<UserLoginUseCase>(TYPES.IUserLoginUseCase);

        inMemoryUserRepository.createTestUser({
            registration: '1234567890',
            password: await hash('senha123', saltRounds),
        });
    });

    afterEach(() => {
        inMemoryUserRepository.clear();
    });

    it('should be defined', () => {
        expect(UserLoginUseCase).toBeDefined();
    });

    it('should login successfully', async () => {
        const loginRequest: IUserLoginRequest = {
            registration: '1234567890',
            password: 'senha123',
        };
        const result = await userLoginUseCase.execute({
            registration: loginRequest.registration,
            password: loginRequest.password,
        });

        expect(result).toBeDefined();
        expect(result.accessToken).toBeDefined();
        expect(result.refreshToken).toBeDefined();
        expect(result.accessToken).not.toBeNull();
        expect(result.refreshToken).not.toBeNull();
    });

    it('should throw NotFoundException when user not found', async () => {
        const loginRequest: IUserLoginRequest = {
            registration: '0000000000',
            password: 'senha123',
        };
        await expect(userLoginUseCase.execute(loginRequest)).rejects.toThrow(NotFoundException);
        expect(userLoginUseCase.execute(loginRequest)).rejects.toThrow('User not found');
    });

    it('should throw BusinessException when password is invalid', async () => {
        const loginRequest: IUserLoginRequest = {
            registration: '1234567890',
            password: 'senha1234',
        };
        await expect(userLoginUseCase.execute(loginRequest)).rejects.toThrow(BusinessException);
        expect(userLoginUseCase.execute(loginRequest)).rejects.toThrow('Invalid password');
    });
});