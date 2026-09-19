var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, } from 'typeorm';
import { Contrato } from './contrato.entity.js';
import { Dia } from './dia.entity.js';
let Rutina = class Rutina {
    idRutina;
    descripcion;
    nombre;
    contrato;
    dias;
};
__decorate([
    PrimaryGeneratedColumn({ name: 'idRutina' }),
    __metadata("design:type", Number)
], Rutina.prototype, "idRutina", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Rutina.prototype, "descripcion", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Rutina.prototype, "nombre", void 0);
__decorate([
    ManyToOne(() => Contrato, (contrato) => contrato.rutinas),
    JoinColumn({ name: 'idContrato' }),
    __metadata("design:type", Object)
], Rutina.prototype, "contrato", void 0);
__decorate([
    OneToMany(() => Dia, (dia) => dia.rutina),
    __metadata("design:type", Object)
], Rutina.prototype, "dias", void 0);
Rutina = __decorate([
    Entity({ name: 'rutinas' })
], Rutina);
export { Rutina };
//# sourceMappingURL=rutina.entity.js.map