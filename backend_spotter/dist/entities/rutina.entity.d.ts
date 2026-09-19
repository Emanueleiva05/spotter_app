import { type Relation } from 'typeorm';
import { Contrato } from './contrato.entity.js';
import { Dia } from './dia.entity.js';
export declare class Rutina {
    idRutina: number;
    descripcion?: string;
    nombre: string;
    contrato: Relation<Contrato>;
    dias: Relation<Dia[]>;
}
