export interface ISession {
    userId: string;
    role: string;
}

export interface CreateRefreshTokenDto {
    token: string;
    userId: string;
    expiresAt: Date;
}

export interface IUserLoginRequest {
    registration: string;
    password: string;
}

export interface IUserLoginResponse {
    accessToken: string;
    refreshToken: string;
}