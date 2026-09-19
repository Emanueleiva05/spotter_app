var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, } from 'typeorm';
import { Contrato } from './contrato.entity.js';
import { Usuario } from './usuario.entity.js';
let Plan = class Plan {
    idPlan;
    descripcion;
    tipo;
    precio;
    cantidadDias;
    estado;
    profesor;
    contratos;
};
__decorate([
    PrimaryGeneratedColumn({ name: 'idPlan' }),
    __metadata("design:type", Number)
], Plan.prototype, "idPlan", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Plan.prototype, "descripcion", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Plan.prototype, "tipo", void 0);
__decorate([
    Column({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], Plan.prototype, "precio", void 0);
__decorate([
    Column({ name: 'cantidadDias' }),
    __metadata("design:type", Number)
], Plan.prototype, "cantidadDias", void 0);
__decorate([
    Column(),
    __metadata("design:type", Boolean)
], Plan.prototype, "estado", void 0);
__decorate([
    ManyToOne(() => Usuario, (usuario) => usuario.planesComoProfesor),
    JoinColumn({ name: 'idProfesor' }),
    __metadata("design:type", Object)
], Plan.prototype, "profesor", void 0);
__decorate([
    OneToMany(() => Contrato, (contrato) => contrato.plan),
    __metadata("design:type", Object)
], Plan.prototype, "contratos", void 0);
Plan = __decorate([
    Entity({ name: 'planes' })
], Plan);
export { Plan };
//# sourceMappingURL=plan.entity.js.map