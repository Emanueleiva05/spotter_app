import { type Relation } from 'typeorm';
import { Usuario } from './usuario.entity.js';
export declare class Salud {
    idSalud: number;
    nombre: string;
    usuario: Relation<Usuario>;
}
