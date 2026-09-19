import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  type Relation,
} from 'typeorm';
import { PlanificacionDia } from './planificacionDia.entity.js';
import { Usuario } from './usuario.entity.js';

@Entity({ name: 'registros_entrenamiento' })
export class RegistroEntrenamiento {
  @PrimaryGeneratedColumn({ name: 'idRegistroEntrenamiento' })
  idRegistroEntrenamiento: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ nullable: true })
  repeticiones?: number;

  @Column({ nullable: true })
  series?: number;

  @Column({ nullable: true })
  RIR?: number;

  @Column({ nullable: true })
  RPE?: number;

  @Column({ type: 'float', nullable: true })
  peso?: number;

  @Column({ type: 'float', name: 'tonalajeTotal' })
  tonalajeTotal: number;

  @ManyToOne(
    () => PlanificacionDia,
    (planificacion) => planificacion.registrosEntrenamiento,
  )
  @JoinColumn({ name: 'idPlanificacionDia' })
  planificacionDia: Relation<PlanificacionDia>;

  @ManyToOne(() => Usuario, (usuario) => usuario.registrosEntrenamiento)
  @JoinColumn({ name: 'idUsuario' })
  usuario: Relation<Usuario>;
}
