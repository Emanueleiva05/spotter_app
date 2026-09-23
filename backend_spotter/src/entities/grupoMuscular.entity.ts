import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  type Relation,
  ManyToOne,
} from 'typeorm';
import { Ejercicio } from './ejercicio.entity.js';

@Entity({ name: 'grupoMuscular' })
export class GrupoMuscular {
  @PrimaryGeneratedColumn({ name: 'idGrupoMuscular' })
  idGrupoMuscular: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion?: string;

  @Column({ nullable: true })
  imagen?: string;

  @ManyToOne(() => Ejercicio, (eje) => eje.grupos)
  ejercicios: Relation<Ejercicio>;
}
