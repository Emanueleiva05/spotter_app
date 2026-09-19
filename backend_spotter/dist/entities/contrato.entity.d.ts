import { type Relation } from 'typeorm';
import { Plan } from './plan.entity.js';
import { Usuario } from './usuario.entity.js';
import { Rutina } from './rutina.entity.js';
export declare enum EstadoContrato {
    ACTIVO = "activo",
    INACTIVO = "inactivo",
    VENCIDO = "vencido"
}
export declare class Contrato {
    idContrato: number;
    nombre: string;
    fechaInicio: Date;
    fechaFin: Date;
    estado: EstadoContrato;
    plan: Relation<Plan>;
    cliente: Relation<Usuario>;
    rutinas: Relation<Rutina[]>;
}
