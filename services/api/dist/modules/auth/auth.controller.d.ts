import { AuthService } from './auth.service';
export declare class RegisterDto {
    email: string;
    password: string;
    name: string;
    phone?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RefreshDto {
    refresh_token: string;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<import("./auth.service").AuthResult>;
    login(dto: LoginDto): Promise<import("./auth.service").AuthResult>;
    logout(req: any): Promise<{
        message: string;
    }>;
    refresh(dto: RefreshDto): Promise<import("./auth.service").AuthResult>;
}
