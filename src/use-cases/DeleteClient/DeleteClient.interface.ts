export interface IDeleteClientUseCase {
  execute(id: string): Promise<void>;
}
