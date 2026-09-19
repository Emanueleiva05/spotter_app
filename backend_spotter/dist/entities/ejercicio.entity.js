var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, } from 'typeorm';
import { PlanificacionDia } from './planificacionDia.entity.js';
let Ejercicio = class Ejercicio {
    idEjercicio;
    descripcion;
    nombre;
    video;
    imagen;
    planificaciones;
};
__decorate([
    PrimaryGeneratedColumn({ name: 'idEjercicio' }),
    __metadata("design:type", Number)
], Ejercicio.prototype, "idEjercicio", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Ejercicio.prototype, "descripcion", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Ejercicio.prototype, "nombre", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Ejercicio.prototype, "video", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Ejercicio.prototype, "imagen", void 0);
__decorate([
    OneToMany(() => PlanificacionDia, (planificacion) => planificacion.ejercicio),
    __metadata("design:type", Object)
], Ejercicio.prototype, "planificaciones", void 0);
Ejercicio = __decorate([
    Entity({ name: 'ejercicios' })
], Ejercicio);
export { Ejercicio };
//# sourceMappingURL=ejercicio.entity.js.map