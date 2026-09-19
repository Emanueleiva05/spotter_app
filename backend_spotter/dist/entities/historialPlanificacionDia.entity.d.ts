import { type Relation } from 'typeorm';
import { PlanificacionDia } from './planificacionDia.entity.js';
export declare class HistorialPlanificacion {
    idHistorialPlanificacion: number;
    peso?: number;
    repeticiones?: number;
    series?: number;
    RIR?: number;
    RPE?: number;
    descanso?: string;
    fechaModificacion: Date;
    planificacionDia: Relation<PlanificacionDia>;
}
