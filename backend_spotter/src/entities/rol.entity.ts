import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  type Relation,
} from 'typeorm';
import { RolUsuario } from './rolUsuario.entity.js';

export enum RolType {
  ALUMNO = 'alumno',
  PROFESOR = 'profesor',
  ADMIN = 'admin',
}

@Entity({ name: 'roles' })
export class Rol {
  @PrimaryGeneratedColumn({ name: 'idRol' })
  idRol: number;

  @Column({ unique: true, type: 'enum', enum: RolType })
  nombre: string;

  @OneToMany(() => RolUsuario, (rolUsuario) => rolUsuario.rol)
  rolUsuario: Relation<RolUsuario[]>;
}
