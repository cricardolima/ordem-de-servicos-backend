import { Role } from "@prisma/client";
import { CreateUserUseCase } from "./CreateUser.use-case";
import { Container } from "inversify";
import { InMemoryUserRepositoryV2 } from "@tests/repositories/InMemoryUserRepositoryV2";
import { ContainerApp } from "@container/inversify.config";
import { TYPES } from "@container/types";
import { IUserRepository } from "@repositories/UserRepository";
import { hashPassword } from "@utils/hashPassword";
import { ICreateUserRequest } from "@dtos/models";
import { BusinessException } from "@exceptions/business.exception";

describe("CreateUserUseCase", () => {
    let testContainer: Container;
    let inMemoryUserRepository: InMemoryUserRepositoryV2;
    let createUserUseCase: CreateUserUseCase;

    beforeEach(async () => {
        testContainer = new ContainerApp().init();
        testContainer.unbind(TYPES.IUserRepository);

        inMemoryUserRepository = new InMemoryUserRepositoryV2();
        testContainer.bind<IUserRepository>(TYPES.IUserRepository).toConstantValue(inMemoryUserRepository);
        createUserUseCase = testContainer.get<CreateUserUseCase>(TYPES.ICreateUserUseCase);

        inMemoryUserRepository.createTestUser({
            registration: "teste user",
            password: await hashPassword("password123"),
        });
    })

    afterEach(() => {
        inMemoryUserRepository.clear();
    })
    
    it("should be defined", () => {
        expect(CreateUserUseCase).toBeDefined();
    })

    it("should create a user", async () => {
        const user: ICreateUserRequest = {
            name: "John Doe",
            registration: "john.doe",
            password: "password123",
            role: Role.ADMIN,
        }

        const result = await createUserUseCase.execute(user);

        expect(result).toBeDefined();
        expect(result.name).toBe(user.name);
        expect(result.registration).toBe(user.registration);
        expect(result.password).not.toBe(user.password);
        expect(result.role).toBe(user.role);
    })

    it("should throw a BusinessException if the user already exists", async () => {
        const user: ICreateUserRequest = {
            name: "John Doe",
            registration: "teste user",
            password: "password123",
            role: Role.ADMIN,
        }

        await expect(createUserUseCase.execute(user)).rejects.toThrow(BusinessException);
    })
})