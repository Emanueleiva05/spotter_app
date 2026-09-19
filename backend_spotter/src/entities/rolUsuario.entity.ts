import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  type Relation,
} from 'typeorm';
import { Rol } from './rol.entity.js';
import { Usuario } from './usuario.entity.js';

@Entity({ name: 'rolUsuarios' })
export class RolUsuario {
  @PrimaryGeneratedColumn({ name: 'idRolUsuario' })
  idRolUsuario: number;

  @Column({ name: 'idRol' })
  idRol: number;

  @Column({ name: 'idUsuario' })
  idUsuario: number;

  @ManyToOne(() => Rol, (rol) => rol.rolUsuario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idRol' })
  rol: Relation<Rol>;

  @ManyToOne(() => Usuario, (usuario) => usuario.rolUsuario, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'idUsuario' })
  usuario: Relation<Usuario>;
}
