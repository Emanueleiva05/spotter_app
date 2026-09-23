import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  type Relation,
} from 'typeorm';
import { Usuario } from './usuario.entity.js';
import { Salud } from './salud.entity.js';

@Entity({ name: 'detalleMedico' })
export class DetalleMedico {
  @PrimaryGeneratedColumn({ name: 'idDetalleMedico' })
  idDetalleMedico: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion?: string;

  @Column({ name: 'idSalud' })
  idSalud: number;

  @ManyToOne(() => Salud, (salud) => salud.detalles)
  @JoinColumn({ name: 'idSalud' })
  salud: Relation<Salud>;
}
