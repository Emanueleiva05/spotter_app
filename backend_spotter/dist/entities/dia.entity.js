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
import { Rutina } from './rutina.entity.js';
import { PlanificacionDia } from './planificacionDia.entity.js';
let Dia = class Dia {
    idDia;
    nombre;
    completo;
    rutina;
    planificaciones;
};
__decorate([
    PrimaryGeneratedColumn({ name: 'idDia' }),
    __metadata("design:type", Number)
], Dia.prototype, "idDia", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Dia.prototype, "nombre", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", Boolean)
], Dia.prototype, "completo", void 0);
__decorate([
    ManyToOne(() => Rutina, (rutina) => rutina.dias),
    JoinColumn({ name: 'idRutina' }),
    __metadata("design:type", Object)
], Dia.prototype, "rutina", void 0);
__decorate([
    OneToMany(() => PlanificacionDia, (planificacion) => planificacion.dia),
    __metadata("design:type", Object)
], Dia.prototype, "planificaciones", void 0);
Dia = __decorate([
    Entity({ name: 'dias' })
], Dia);
export { Dia };
//# sourceMappingURL=dia.entity.js.map