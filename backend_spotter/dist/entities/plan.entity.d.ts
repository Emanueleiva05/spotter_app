import { type Relation } from 'typeorm';
import { Contrato } from './contrato.entity.js';
import { Usuario } from './usuario.entity.js';
export declare class Plan {
    idPlan: number;
    descripcion?: string;
    tipo: string;
    precio?: number;
    cantidadDias: number;
    estado: boolean;
    profesor: Relation<Usuario>;
    contratos: Relation<Contrato[]>;
}
