import { Pessoa } from './pessoa.interface';
import { Role } from './role.interface';

export interface Usuario {
    id: number;
    name: string;
    email: string;
    email_verified_at: boolean;
    status: boolean;
    image: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
    roles: Role[];
    pessoa: Pessoa;
}

