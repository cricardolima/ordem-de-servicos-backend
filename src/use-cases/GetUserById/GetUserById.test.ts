import { Container } from "inversify";
import { ContainerApp } from "@container/inversify.config";
import { TYPES } from "@container/types";
import { IUserRepository } from "@repositories/UserRepository";
import { InMemoryUserRepositoryV2 } from "@tests/repositories/InMemoryUserRepositoryV2";
import { GetUserByIdUseCase } from "./GetUserById.use-case";
import { User } from "@prisma/client";

describe("GetUserByIdUseCase", () => {
    let testContainer: Container;
    let inMemoryUserRepository: InMemoryUserRepositoryV2;
    let getUserByIdUseCase: GetUserByIdUseCase;
    let user: User;

    beforeEach(async () => {
        testContainer = new ContainerApp().init();
        testContainer.unbind(TYPES.IUserRepository);

        inMemoryUserRepository = new InMemoryUserRepositoryV2();
        testContainer.bind<IUserRepository>(TYPES.IUserRepository).toConstantValue(inMemoryUserRepository);

        getUserByIdUseCase = testContainer.get<GetUserByIdUseCase>(TYPES.IGetUserByIdUseCase);

        user = inMemoryUserRepository.createTestUser();
    });

    afterEach(() => {
        inMemoryUserRepository.clear();
    });

    it("should be defined", () => {
        expect(GetUserByIdUseCase).toBeDefined();
    });

    it("should get a user by id", async () => {
        const result = await getUserByIdUseCase.execute(user.id);

        expect(result).toBeDefined();
        expect(result.id).toBe(user.id);
        expect(result.name).toBe(user.name);
        expect(result.registration).toBe(user.registration);
        expect(result.role).toBe(user.role);
        expect(result.createdAt).toBe(user.createdAt);
        expect(result.updatedAt).toBe(user.updatedAt);
        expect(result.deletedAt).toBeNull();
    });

    it("should throw an error if the user does not exist or is already deleted", async () => {
        await expect(getUserByIdUseCase.execute("non-existent-user-id")).rejects.toThrow("User not found");
    });
});