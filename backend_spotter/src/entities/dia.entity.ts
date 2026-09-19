import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  type Relation,
} from 'typeorm';
import { Rutina } from './rutina.entity.js';
import { PlanificacionDia } from './planificacionDia.entity.js';

@Entity({ name: 'dias' })
export class Dia {
  @PrimaryGeneratedColumn({ name: 'idDia' })
  idDia: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  completo?: boolean;

  @ManyToOne(() => Rutina, (rutina) => rutina.dias)
  @JoinColumn({ name: 'idRutina' })
  rutina: Relation<Rutina>;

  @OneToMany(() => PlanificacionDia, (planificacion) => planificacion.dia)
  planificaciones: Relation<PlanificacionDia[]>;
}
