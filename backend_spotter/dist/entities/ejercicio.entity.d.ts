import { type Relation } from 'typeorm';
import { PlanificacionDia } from './planificacionDia.entity.js';
export declare class Ejercicio {
    idEjercicio: number;
    descripcion: string;
    nombre: string;
    video?: string;
    imagen?: string;
    planificaciones: Relation<PlanificacionDia[]>;
}
