import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  type Relation,
} from 'typeorm';
import { PlanificacionDia } from './planificacionDia.entity.js';

@Entity({ name: 'historialPlanificaciones' })
export class HistorialPlanificacion {
  @PrimaryGeneratedColumn({ name: 'idHistorialPlanificacion' })
  idHistorialPlanificacion: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaModificacion: Date;

  @ManyToOne(() => PlanificacionDia, (planDia) => planDia.historiales)
  @JoinColumn({ name: 'idPlanificacionDia' })
  planificacionDia: Relation<PlanificacionDia>;
}
