export interface IDeleteServiceTypeUseCase {
    execute(id: string): Promise<void>;
}