import { injectable } from "inversify";
import { IUserRepository } from "@repositories/UserRepository/user.respository.interface";
import { User, Role } from "@prisma/client";
import { BaseInMemoryRepository } from "./BaseInMemoryRepository";
import { ICreateUserRequest, IUpdateUserRequest } from "@dtos/models";

@injectable()
export class InMemoryUserRepositoryV2 extends BaseInMemoryRepository<User> implements IUserRepository {
    
    public async findAll(): Promise<User[]> {
        return this.items;
    }

    public async findByRegistration(registration: string): Promise<User | null> {
        return this.findByProperty('registration', registration) || null;
    }

    
    public async findById(id: string): Promise<User | null> {
        return this.findByProperty('id', id) || null;
    }

    
    public async findByRole(role: Role): Promise<User[]> {
        return this.findAllByProperty('role', role);
    }

    
    public async existsByRegistration(registration: string): Promise<boolean> {
        return this.findByProperty('registration', registration) !== undefined;
    }

    
    public createTestUser(overrides: Partial<User> = {}): User {
        const defaultUser: User = {
            id: this.generateUUID(),
            name: 'Test User',
            password: 'hashedPassword123',
            registration: '1234567890',
            createdAt: new Date(),
            updatedAt: null,
            deletedAt: null,
            role: Role.USER,
            ...overrides
        };

        this.addItem(defaultUser);
        return defaultUser;
    }

    
    public createTestUsers(count: number, baseOverrides: Partial<User> = {}): User[] {
        const users: User[] = [];
        
        for (let i = 0; i < count; i++) {
            const user = this.createTestUser({
                ...baseOverrides,
                registration: `${baseOverrides.registration || '1234567890'}${i}`,
                name: `${baseOverrides.name || 'Test User'} ${i + 1}`
            });
            users.push(user);
        }

        return users;
    }

    
    public async findByName(name: string): Promise<User[]> {
        return this.items.filter(user => 
            user.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    
    public async findActiveUsers(): Promise<User[]> {
        return this.items.filter(user => !user.deletedAt);
    }

    
    public async findDeletedUsers(): Promise<User[]> {
        return this.items.filter(user => user.deletedAt !== null);
    }

    
    public async softDelete(id: string): Promise<boolean> {
        return this.updateByProperty('id', id, { 
            deletedAt: new Date() 
        });
    }

    
    public async restore(id: string): Promise<boolean> {
        return this.updateByProperty('id', id, { 
            deletedAt: null 
        });
    }

    public async create(user: ICreateUserRequest): Promise<User> {
        return this.createTestUser(user);
    }

    public async update(userId: string, data: IUpdateUserRequest): Promise<void> {
        this.updateByProperty('id', userId, data);
    }
}
