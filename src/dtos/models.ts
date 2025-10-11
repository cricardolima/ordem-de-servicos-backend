import { Role, ServicesType } from "@prisma/client";

export interface ISession {
    userId: string;
    role: string;
}

export interface CreateRefreshTokenDto {
    token: string;
    userId: string;
    expiresAt: string;
}

export interface IUserLoginRequest {
    registration: string;
    password: string;
}

export interface IUserLoginResponse {
    accessToken: string;
}

export interface IRefreshTokenRequestDto {
    refreshToken: string;
}

export interface IValidateRefreshTokenResponse {
    userId: string;
    tokenId: string;
}

export type Roles = "ADMIN" | "USER" | Role | Role[];

export interface ICreateUserRequest {
    name: string;
    registration: string;
    password: string;
    role: Role;
}

export interface IUpdateUserRequest {
    name?: string;
    registration?: string;
    password?: string;
    role?: Role;
}

export interface ICreateServicesTypeRequest extends Omit<ServicesType, "id" | "createdAt" | "updatedAt" | "deletedAt"> {}

export interface IUpdateServicesTypeRequest extends Omit<ServicesType, "id" | "createdAt" | "updatedAt" | "deletedAt"> {}