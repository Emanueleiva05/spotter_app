import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Relation,
} from 'typeorm';
import { RolUsuario } from './rolUsuario.entity.js';

@Entity({ name: 'roles' })
export class Rol {
  @PrimaryGeneratedColumn()
  idRol: number;

  @Column()
  nombre: string;

  @OneToMany(() => RolUsuario, (rolUsuario) => rolUsuario.rol)
  rolUsuario: Relation<RolUsuario>[];
}
