import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  type Relation,
} from 'typeorm';
import { Plan } from './plan.entity.js';
import { Usuario } from './usuario.entity.js';
import { Rutina } from './rutina.entity.js';

export enum EstadoContrato {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
  VENCIDO = 'vencido',
}

@Entity({ name: 'contratos' })
export class Contrato {
  @PrimaryGeneratedColumn({ name: 'idContrato' })
  idContrato: number;

  @Column()
  nombre: string;

  @Column({ type: 'date', name: 'fechaInicio' })
  fechaInicio: Date;

  @Column({ type: 'date', name: 'fechaFin' })
  fechaFin: Date;

  @Column({
    type: 'enum',
    enum: EstadoContrato,
  })
  estado: EstadoContrato;

  @Column({ nullable: true })
  comentarioAlumno?: string;

  @ManyToOne(() => Plan, (plan) => plan.contratos)
  @JoinColumn({ name: 'idPlan' })
  plan: Relation<Plan>;

  @ManyToOne(() => Usuario, (usuario) => usuario.contratosComoCliente)
  @JoinColumn({ name: 'idCliente' })
  cliente: Relation<Usuario>;

  @OneToMany(() => Rutina, (rutina) => rutina.contrato)
  rutinas: Relation<Rutina[]>;
}
