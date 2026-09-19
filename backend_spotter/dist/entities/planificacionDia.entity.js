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
import { Dia } from './dia.entity.js';
import { Ejercicio } from './ejercicio.entity.js';
import { RegistroEntrenamiento } from './registroEntrenamiento.entity.js';
import { HistorialPlanificacion } from './historialPlanificacionDia.entity.js';
let PlanificacionDia = class PlanificacionDia {
    idPlanificacionDia;
    peso;
    repeticiones;
    series;
    RIR;
    RPE;
    descanso;
    dia;
    ejercicio;
    registrosEntrenamiento;
    historiales;
};
__decorate([
    PrimaryGeneratedColumn({ name: 'idPlanificacionDia' }),
    __metadata("design:type", Number)
], PlanificacionDia.prototype, "idPlanificacionDia", void 0);
__decorate([
    Column({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], PlanificacionDia.prototype, "peso", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", Number)
], PlanificacionDia.prototype, "repeticiones", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", Number)
], PlanificacionDia.prototype, "series", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", Number)
], PlanificacionDia.prototype, "RIR", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", Number)
], PlanificacionDia.prototype, "RPE", void 0);
__decorate([
    Column({ type: 'time', nullable: true }),
    __metadata("design:type", String)
], PlanificacionDia.prototype, "descanso", void 0);
__decorate([
    ManyToOne(() => Dia, (dia) => dia.planificaciones),
    JoinColumn({ name: 'idDia' }),
    __metadata("design:type", Object)
], PlanificacionDia.prototype, "dia", void 0);
__decorate([
    ManyToOne(() => Ejercicio, (ejercicio) => ejercicio.planificaciones),
    JoinColumn({ name: 'idEjercicio' }),
    __metadata("design:type", Object)
], PlanificacionDia.prototype, "ejercicio", void 0);
__decorate([
    OneToMany(() => RegistroEntrenamiento, (registro) => registro.planificacionDia),
    __metadata("design:type", Object)
], PlanificacionDia.prototype, "registrosEntrenamiento", void 0);
__decorate([
    OneToMany(() => HistorialPlanificacion, (his) => his.planificacionDia),
    __metadata("design:type", Object)
], PlanificacionDia.prototype, "historiales", void 0);
PlanificacionDia = __decorate([
    Entity({ name: 'planificaciones_dias' })
], PlanificacionDia);
export { PlanificacionDia };
//# sourceMappingURL=planificacionDia.entity.js.map