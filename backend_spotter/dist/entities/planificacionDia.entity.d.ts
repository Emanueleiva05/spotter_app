import { type Relation } from 'typeorm';
import { Dia } from './dia.entity.js';
import { Ejercicio } from './ejercicio.entity.js';
import { RegistroEntrenamiento } from './registroEntrenamiento.entity.js';
export declare class PlanificacionDia {
    idPlanificacionDia: number;
    peso?: number;
    repeticiones?: number;
    series?: number;
    RIR?: number;
    RPE?: number;
    descanso?: string;
    dia: Relation<Dia>;
    ejercicio: Relation<Ejercicio>;
    registrosEntrenamiento: Relation<RegistroEntrenamiento[]>;
}
