export const TYPES = {
    // Repositories
    IUserRepository: "IUserRepository",
    IRefreshTokenRepository: "IRefreshTokenRepository",
    IServicesTypeRepository: "IServicesTypeRepository",
    IProfessionalsRepository: "IProfessionalsRepository",
    IClientsRepository: "IClientsRepository",
    IClientAddressRepository: "IClientAddressRepository",
    // Auth
    IUserLoginUseCase: "IUserLoginUseCase",

    // Refresh Token
    IGenerateRefreshTokenUseCase: "IGenerateRefreshTokenUseCase",
    IRefreshTokenUseCase: "IRefreshTokenUseCase",

    // User
    ICreateUserUseCase: "ICreateUserUseCase",
    IUpdateUserUseCase: "IUpdateUserUseCase",
    IDeleteUserUseCase: "IDeleteUserUseCase",
    IGetUserByIdUseCase: "IGetUserByIdUseCase",
    IGetUsersUseCase: "IGetUsersUseCase",
    IGetAllUsersUseCase: "IGetAllUsersUseCase",

    // Services Type
    IGetServicesTypeUseCase: "IGetServicesTypeUseCase",
    ICreateServicesTypeUseCase: "ICreateServicesTypeUseCase",
    IDeleteServiceTypeUseCase: "IDeleteServiceTypeUseCase",
    IUpdateServicesTypeUseCase: "IUpdateServicesTypeUseCase",
    IGetServicesTypeByIdUseCase: "IGetServicesTypeByIdUseCase",

    // Professionals
    ICreateProfessionalsUseCase: "ICreateProfessionalsUseCase",
    IGetProfessionalByIdUseCase: "IGetProfessionalByIdUseCase",
    IGetProfessionalsUseCase: "IGetProfessionalsUseCase",
    IUpdateProfessionalUseCase: "IUpdateProfessionalUseCase",
    IDeleteProfessionalUseCase: "IDeleteProfessionalUseCase",

    // Clients
    ICreateClientUseCase: "ICreateClientUseCase",
    IGetClientByIdUseCase: "IGetClientByIdUseCase",
};