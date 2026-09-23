import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  type Relation,
  OneToMany,
} from 'typeorm';
import { Usuario } from './usuario.entity.js';
import { DetalleMedico } from './detelleMedico.entity.js';

export enum Sexo {
  FEMENINO = 'femenino',
  MASCULINO = 'masculino',
  PREFIERO_NO_DECIRLO = 'prefiero no decirlo',
}

@Entity({ name: 'salud' })
export class Salud {
  @PrimaryGeneratedColumn({ name: 'idSalud' })
  idSalud: number;

  @Column({ type: 'float' })
  peso: number;

  @Column({ type: 'float' })
  altura: number;

  @Column({ type: 'enum', enum: Sexo })
  sexo: string;

  @Column({ name: 'idUsuario' })
  idUsuario: number;

  @Column({ name: 'idSalud' })
  idDetalleMedico: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.registrosSalud)
  @JoinColumn({ name: 'idUsuario' })
  usuario: Relation<Usuario>;

  @OneToMany(() => DetalleMedico, (detalle) => detalle.salud)
  @JoinColumn({ name: 'idDetalleMedico' })
  detalles: Relation<DetalleMedico[]>;
}
