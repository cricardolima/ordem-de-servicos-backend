import { IUserLoginRequest, IUserLoginResponse } from "@dtos/models";
import { Response } from "express";

export interface IUserLoginUseCase {
    execute(request: IUserLoginRequest, res: Response): Promise<IUserLoginResponse>;
}