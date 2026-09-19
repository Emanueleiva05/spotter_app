var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, } from 'typeorm';
import { Usuario } from './usuario.entity.js';
let Salud = class Salud {
    idSalud;
    nombre;
    idUsuario;
    usuario;
};
__decorate([
    PrimaryGeneratedColumn({ name: 'idSalud' }),
    __metadata("design:type", Number)
], Salud.prototype, "idSalud", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Salud.prototype, "nombre", void 0);
__decorate([
    Column({ name: 'idUsuario' }),
    __metadata("design:type", Number)
], Salud.prototype, "idUsuario", void 0);
__decorate([
    ManyToOne(() => Usuario, (usuario) => usuario.registrosSalud),
    JoinColumn({ name: 'idUsuario' }),
    __metadata("design:type", Object)
], Salud.prototype, "usuario", void 0);
Salud = __decorate([
    Entity({ name: 'salud' })
], Salud);
export { Salud };
//# sourceMappingURL=salud.entity.js.map