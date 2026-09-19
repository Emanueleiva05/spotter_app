import { type Relation } from 'typeorm';
import { Salud } from './salud.entity.js';
import { RolUsuario } from './rolUsuario.entity.js';
import { Contrato } from './contrato.entity.js';
import { Plan } from './plan.entity.js';
import { RegistroEntrenamiento } from './registroEntrenamiento.entity.js';
export declare enum Sexo {
    FEMENINO = "femenino",
    MASCULINO = "masculino",
    PREFIERO_NO_DECIRLO = "prefiero no decirlo"
}
export declare class Usuario {
    idUsuario: number;
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    sexo: Sexo;
    imagen?: string;
    peso?: number;
    altura?: number;
    fechaNacimiento?: Date;
    salud: Relation<Salud[]>;
    rolUsuario: Relation<RolUsuario[]>;
    contratosComoCliente: Relation<Contrato[]>;
    planesComoProfesor: Relation<Plan[]>;
    registrosEntrenamiento: Relation<RegistroEntrenamiento[]>;
}
