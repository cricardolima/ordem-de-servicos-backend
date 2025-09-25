import { IUserLoginRequest, IUserLoginResponse } from "@dtos/models";

export interface IUserLoginUseCase {
    execute(request: IUserLoginRequest): Promise<IUserLoginResponse>;
}