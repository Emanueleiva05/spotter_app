import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  type Relation,
} from 'typeorm';
import { Contrato } from './contrato.entity.js';
import { Dia } from './dia.entity.js';

@Entity({ name: 'rutinas' })
export class Rutina {
  @PrimaryGeneratedColumn({ name: 'idRutina' })
  idRutina: number;

  @Column({ nullable: true })
  descripcion?: string;

  @Column()
  nombre: string;

  @ManyToOne(() => Contrato, (contrato) => contrato.rutinas)
  @JoinColumn({ name: 'idContrato' })
  contrato: Relation<Contrato>;

  @OneToMany(() => Dia, (dia) => dia.rutina)
  dias: Relation<Dia[]>;
}
