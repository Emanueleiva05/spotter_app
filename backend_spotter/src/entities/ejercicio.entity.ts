import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  type Relation,
} from 'typeorm';
import { PlanificacionDia } from './planificacionDia.entity.js';

@Entity({ name: 'ejercicios' })
export class Ejercicio {
  @PrimaryGeneratedColumn({ name: 'idEjercicio' })
  idEjercicio: number;

  @Column()
  descripcion: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  video?: string;

  @Column({ nullable: true })
  imagen?: string;

  @OneToMany(() => PlanificacionDia, (planificacion) => planificacion.ejercicio)
  planificaciones: Relation<PlanificacionDia[]>;
}
