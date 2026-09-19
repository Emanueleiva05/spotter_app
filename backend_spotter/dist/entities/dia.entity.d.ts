import { type Relation } from 'typeorm';
import { Rutina } from './rutina.entity.js';
import { PlanificacionDia } from './planificacionDia.entity.js';
export declare class Dia {
    idDia: number;
    nombre: string;
    completo?: boolean;
    rutina: Relation<Rutina>;
    planificaciones: Relation<PlanificacionDia[]>;
}
