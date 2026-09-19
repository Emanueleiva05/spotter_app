import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  type Relation,
} from 'typeorm';
import { Usuario } from './usuario.entity.js';

@Entity({ name: 'salud' })
export class Salud {
  @PrimaryGeneratedColumn()
  idSalud: number;

  @Column()
  nombre: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.salud)
  usuario: Relation<Usuario>;
}
