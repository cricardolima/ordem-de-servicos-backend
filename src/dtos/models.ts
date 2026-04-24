import type { Client, ClientAddress, Professionals, Role, ServicesType, User } from '@prisma/client';

type OmitedPrismaModel<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

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

export type Roles = 'ADMIN' | 'USER' | Role | Role[];

export interface ICreateUserRequest {
  name: string;
  registration: string;
  password: string;
  role: Role;
}

export type IUserResponse = Omit<User, 'password' | 'deletedAt'>;

export function toUserResponse(user: User): IUserResponse {
  const { password: _password, deletedAt: _deletedAt, ...userResponse } = user;
  return userResponse;
}

export type IClientAddressResponse = Omit<ClientAddress, 'deletedAt'>;

export type IClientWithAddress = Client & {
  clientAddress?: ClientAddress[];
};

export type IClientResponse = Omit<IClientWithAddress, 'deletedAt' | 'clientAddress'> & {
  clientAddress: IClientAddressResponse[];
};

export function toClientResponse(client: IClientWithAddress): IClientResponse {
  const { deletedAt: _deletedAt, clientAddress, ...clientResponse } = client;

  return {
    ...clientResponse,
    clientAddress: (clientAddress ?? []).map(({ deletedAt: _addressDeletedAt, ...addressResponse }) => addressResponse),
  };
}

export interface IUpdateUserRequest {
  name?: string;
  registration?: string;
  password?: string;
  role?: Role;
}

export interface ICreateServicesTypeRequest extends OmitedPrismaModel<ServicesType> {}

export interface IUpdateServicesTypeRequest extends OmitedPrismaModel<ServicesType> {}

export interface ICreateProfessionalsRequest extends OmitedPrismaModel<Professionals> {}

export interface IUpdateProfessionalsRequest extends OmitedPrismaModel<Professionals> {}

export interface ICreateClientRequest extends OmitedPrismaModel<Client> {
  id?: string;
  address: ICreateClientAddressRequest[];
}

export interface ICreateClientAddressRequest extends OmitedPrismaModel<ClientAddress> {
  id?: string;
}
