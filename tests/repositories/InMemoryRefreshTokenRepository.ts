import { injectable } from "inversify";
import { IRefreshTokenRepository } from "@repositories/RefreshTokenRepository";
import { RefreshToken } from "@prisma/client";
import { CreateRefreshTokenDto } from "@dtos/models";
import dayjs from "dayjs";

@injectable()
export class InMemoryRefreshTokenRepository implements IRefreshTokenRepository {
    private refreshTokens: RefreshToken[] = [];

    public addRefreshToken(token: RefreshToken): void {
        this.refreshTokens.push(token);
    }

    public addRefreshTokens(tokens: RefreshToken[]): void {
        this.refreshTokens.push(...tokens);
    }

    public clear(): void {
        this.refreshTokens = [];
    }

    public getAllRefreshTokens(): RefreshToken[] {
        return [...this.refreshTokens];
    }

    public async create(data: CreateRefreshTokenDto): Promise<RefreshToken> {
        const refreshToken: RefreshToken = {
            id: this.generateId(),
            token: data.token,
            userId: data.userId,
            expiresAt: data.expiresAt,
            createdAt: new Date(),
            revokedAt: null
        };

        this.refreshTokens.push(refreshToken);
        return refreshToken;
    }

    public async findByToken(token: string): Promise<RefreshToken | null> {
        const refreshToken = this.refreshTokens.find(rt => rt.token === token);

        return refreshToken || null;
    }

    public async revokeByToken(token: string): Promise<void> {
        const refreshToken = this.refreshTokens.find(rt => rt.token === token);
        
        if (refreshToken) {
            refreshToken.revokedAt = new Date();
        }
    }

    public async revokeAllByUserId(userId: string): Promise<void> {
        this.refreshTokens
            .filter(rt => rt.userId === userId)
            .forEach(rt => {
                rt.revokedAt = new Date();
            });
    }

    public async findById(id: string): Promise<RefreshToken | null> {
        return this.refreshTokens.find(rt => rt.id === id) || null;
    }

    public async findByUserId(userId: string): Promise<RefreshToken[]> {
        return this.refreshTokens.filter(rt => rt.userId === userId);
    }
    
    public async findValidByUserId(userId: string): Promise<RefreshToken[]> {
        const now = dayjs().unix().toString();
        return this.refreshTokens.filter(rt => 
            rt.userId === userId && 
            !rt.revokedAt && 
            rt.expiresAt > now
        );
    }
    
    public async existsByToken(token: string): Promise<boolean> {
        return this.refreshTokens.some(rt => rt.token === token);
    }
    
    public async count(): Promise<number> {
        return this.refreshTokens.length;
    }
 
    public async countByUserId(userId: string): Promise<number> {
        return this.refreshTokens.filter(rt => rt.userId === userId).length;
    }

    private generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }
}
