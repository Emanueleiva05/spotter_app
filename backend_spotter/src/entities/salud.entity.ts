import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  type Relation,
} from 'typeorm';
import { Usuario } from './usuario.entity.js';

@Entity({ name: 'salud' })
export class Salud {
  @PrimaryGeneratedColumn({ name: 'idSalud' })
  idSalud: number;

  @Column()
  nombre: string;

  @Column({ name: 'idUsuario' })
  idUsuario: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.registrosSalud)
  @JoinColumn({ name: 'idUsuario' })
  usuario: Relation<Usuario>;
}
