import { type Relation } from 'typeorm';
import { PlanificacionDia } from './planificacionDia.entity.js';
import { Usuario } from './usuario.entity.js';
export declare class RegistroEntrenamiento {
    idRegistroEntrenamiento: number;
    fecha: Date;
    repeticiones?: number;
    series?: number;
    RIR?: number;
    RPE?: number;
    peso?: number;
    tonalajeTotal: number;
    planificacionDia: Relation<PlanificacionDia>;
    usuario: Relation<Usuario>;
}
