import api from "./api";
import type { TokenResponse } from "../types/auth.types";

export interface LoginPayload {
    email: string;
    password: string;
}

const AuthService = {
    async login(payload: LoginPayload): Promise<TokenResponse> {
        const { data } = await api.post<TokenResponse>("/auth/login", payload);
        return data;
    }
};

export interface User {
    id_usuario: string;
    nombre: string;
    apellido: string;
    email: string;
    is_active: boolean;
    is_superuser: boolean;
}

export default AuthService;
