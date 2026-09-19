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
import { Plan } from './plan.entity.js';
import { Usuario } from './usuario.entity.js';
import { Rutina } from './rutina.entity.js';
export var EstadoContrato;
(function (EstadoContrato) {
    EstadoContrato["ACTIVO"] = "activo";
    EstadoContrato["INACTIVO"] = "inactivo";
    EstadoContrato["VENCIDO"] = "vencido";
})(EstadoContrato || (EstadoContrato = {}));
let Contrato = class Contrato {
    idContrato;
    nombre;
    fechaInicio;
    fechaFin;
    estado;
    plan;
    cliente;
    rutinas;
};
__decorate([
    PrimaryGeneratedColumn({ name: 'idContrato' }),
    __metadata("design:type", Number)
], Contrato.prototype, "idContrato", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Contrato.prototype, "nombre", void 0);
__decorate([
    Column({ type: 'date', name: 'fechaInicio' }),
    __metadata("design:type", Date)
], Contrato.prototype, "fechaInicio", void 0);
__decorate([
    Column({ type: 'date', name: 'fechaFin' }),
    __metadata("design:type", Date)
], Contrato.prototype, "fechaFin", void 0);
__decorate([
    Column({
        type: 'enum',
        enum: EstadoContrato,
    }),
    __metadata("design:type", String)
], Contrato.prototype, "estado", void 0);
__decorate([
    ManyToOne(() => Plan, (plan) => plan.contratos),
    JoinColumn({ name: 'idPlan' }),
    __metadata("design:type", Object)
], Contrato.prototype, "plan", void 0);
__decorate([
    ManyToOne(() => Usuario, (usuario) => usuario.contratosComoCliente),
    JoinColumn({ name: 'idCliente' }),
    __metadata("design:type", Object)
], Contrato.prototype, "cliente", void 0);
__decorate([
    OneToMany(() => Rutina, (rutina) => rutina.contrato),
    __metadata("design:type", Object)
], Contrato.prototype, "rutinas", void 0);
Contrato = __decorate([
    Entity({ name: 'contratos' })
], Contrato);
export { Contrato };
//# sourceMappingURL=contrato.entity.js.map