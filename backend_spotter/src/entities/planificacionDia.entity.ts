import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  type Relation,
} from 'typeorm';
import { Dia } from './dia.entity.js';
import { Ejercicio } from './ejercicio.entity.js';
import { RegistroEntrenamiento } from './registroEntrenamiento.entity.js';
import { HistorialPlanificacion } from './historialPlanificacionDia.entity.js';

@Entity({ name: 'planificaciones_dias' })
export class PlanificacionDia {
  @PrimaryGeneratedColumn({ name: 'idPlanificacionDia' })
  idPlanificacionDia: number;

  @Column({ type: 'float', nullable: true })
  peso?: number;

  @Column({ nullable: true })
  repeticiones?: number;

  @Column({ nullable: true })
  series?: number;

  @Column({ nullable: true })
  RIR?: number;

  @Column({ nullable: true })
  RPE?: number;

  @Column({ type: 'time', nullable: true })
  descanso?: string;

  @ManyToOne(() => Dia, (dia) => dia.planificaciones)
  @JoinColumn({ name: 'idDia' })
  dia: Relation<Dia>;

  @ManyToOne(() => Ejercicio, (ejercicio) => ejercicio.planificaciones)
  @JoinColumn({ name: 'idEjercicio' })
  ejercicio: Relation<Ejercicio>;

  @OneToMany(
    () => RegistroEntrenamiento,
    (registro) => registro.planificacionDia,
  )
  registrosEntrenamiento: Relation<RegistroEntrenamiento[]>;

  @OneToMany(() => HistorialPlanificacion, (his) => his.planificacionDia)
  historiales: Relation<HistorialPlanificacion[]>;
}
