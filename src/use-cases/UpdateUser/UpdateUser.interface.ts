import { IUpdateUserRequest } from "@dtos/models";

export interface IUpdateUserUseCase {
    execute(userId: string, data: IUpdateUserRequest): Promise<void>;
}