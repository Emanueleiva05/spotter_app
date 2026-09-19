import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  type Relation,
} from 'typeorm';
import { Rol } from './rol.entity.js';
import { Usuario } from './usuario.entity.js';

@Entity({ name: 'rolUsuarios' })
export class RolUsuario {
  @PrimaryGeneratedColumn()
  idRolUsuario: number;

  @ManyToOne(() => Rol, (rol) => rol.rolUsuario)
  rol: Relation<Rol>;

  @ManyToOne(() => Usuario, (usuario) => usuario.rolUsuario)
  usuario: Relation<Usuario>;
}
