import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  type Relation,
} from 'typeorm';
import { Salud } from './salud.entity.js';
import { RolUsuario } from './rolUsuario.entity.js';
import { Contrato } from './contrato.entity.js';
import { Plan } from './plan.entity.js';
import { RegistroEntrenamiento } from './registroEntrenamiento.entity.js';

export enum Sexo {
  FEMENINO = 'femenino',
  MASCULINO = 'masculino',
  PREFIERO_NO_DECIRLO = 'prefiero no decirlo',
}

@Entity({ name: 'usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'idUsuario' })
  idUsuario: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Sexo,
  })
  sexo: Sexo;

  @Column({ nullable: true })
  imagen?: string;

  @Column({ nullable: true, type: 'float' })
  peso?: number;

  @Column({ nullable: true, type: 'float' })
  altura?: number;

  @Column({ type: 'date', nullable: true, name: 'fechaNacimiento' })
  fechaNacimiento?: Date;

  @OneToMany(() => Salud, (salud) => salud.usuario)
  salud: Relation<Salud[]>;

  @OneToMany(() => RolUsuario, (rolUsuario) => rolUsuario.usuario)
  rolUsuario: Relation<RolUsuario[]>;

  @OneToMany(() => Contrato, (contrato) => contrato.cliente)
  contratosComoCliente: Relation<Contrato[]>;

  @OneToMany(() => Plan, (plan) => plan.profesor)
  planesComoProfesor: Relation<Plan[]>;

  @OneToMany(() => RegistroEntrenamiento, (registro) => registro.usuario)
  registrosEntrenamiento: Relation<RegistroEntrenamiento[]>;
}
