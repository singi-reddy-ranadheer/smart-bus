import { UsersService } from './users.service';
export declare class UpdateUserDto {
    name?: string;
    phone?: string;
    avatar_url?: string;
}
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(userId: string): Promise<any>;
    updateMe(userId: string, dto: UpdateUserDto): Promise<any>;
    listUsers(page?: number, limit?: number, role?: string): Promise<{
        data: any[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
