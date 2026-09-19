import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  type Relation,
} from 'typeorm';
import { RolUsuario } from './rolUsuario.entity.js';

@Entity({ name: 'roles' })
export class Rol {
  @PrimaryGeneratedColumn({ name: 'idRol' })
  idRol: number;

  @Column({ unique: true })
  nombre: string;

  @OneToMany(() => RolUsuario, (rolUsuario) => rolUsuario.rol)
  rolUsuario: Relation<RolUsuario[]>;
}
