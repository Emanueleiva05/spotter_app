import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  type Relation,
} from 'typeorm';
import { Contrato } from './contrato.entity.js';
import { Usuario } from './usuario.entity.js';

@Entity({ name: 'planes' })
export class Plan {
  @PrimaryGeneratedColumn({ name: 'idPlan' })
  idPlan: number;

  @Column({ nullable: true })
  descripcion?: string;

  @Column()
  tipo: string;

  @Column({ type: 'float', nullable: true })
  precio?: number;

  @Column({ name: 'cantidadDias' })
  cantidadDias: number;

  @Column()
  estado: boolean;

  @ManyToOne(() => Usuario, (usuario) => usuario.planesComoProfesor)
  @JoinColumn({ name: 'idProfesor' })
  profesor: Relation<Usuario>;

  @OneToMany(() => Contrato, (contrato) => contrato.plan)
  contratos: Relation<Contrato[]>;
}
