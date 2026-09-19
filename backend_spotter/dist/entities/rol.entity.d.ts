import { type Relation } from 'typeorm';
import { RolUsuario } from './rolUsuario.entity.js';
export declare class Rol {
    idRol: number;
    nombre: string;
    rolUsuario: Relation<RolUsuario[]>;
}
