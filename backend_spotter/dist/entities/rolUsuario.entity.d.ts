import { type Relation } from 'typeorm';
import { Rol } from './rol.entity.js';
import { Usuario } from './usuario.entity.js';
export declare class RolUsuario {
    idRolUsuario: number;
    idRol: number;
    idUsuario: number;
    rol: Relation<Rol>;
    usuario: Relation<Usuario>;
}
