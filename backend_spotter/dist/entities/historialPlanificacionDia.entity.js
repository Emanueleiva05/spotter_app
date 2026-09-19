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
import { PlanificacionDia } from './planificacionDia.entity.js';
let HistorialPlanificacion = class HistorialPlanificacion {
    idHistorialPlanificacion;
    peso;
    repeticiones;
    series;
    RIR;
    RPE;
    descanso;
    fechaModificacion;
    planificacionDia;
};
__decorate([
    PrimaryGeneratedColumn({ name: 'idHistorialPlanificacion' }),
    __metadata("design:type", Number)
], HistorialPlanificacion.prototype, "idHistorialPlanificacion", void 0);
__decorate([
    Column({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], HistorialPlanificacion.prototype, "peso", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", Number)
], HistorialPlanificacion.prototype, "repeticiones", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", Number)
], HistorialPlanificacion.prototype, "series", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", Number)
], HistorialPlanificacion.prototype, "RIR", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", Number)
], HistorialPlanificacion.prototype, "RPE", void 0);
__decorate([
    Column({ type: 'time', nullable: true }),
    __metadata("design:type", String)
], HistorialPlanificacion.prototype, "descanso", void 0);
__decorate([
    Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], HistorialPlanificacion.prototype, "fechaModificacion", void 0);
__decorate([
    ManyToOne(() => PlanificacionDia, (planDia) => planDia.historiales),
    JoinColumn({ name: 'idPlanificacionDia' }),
    __metadata("design:type", Object)
], HistorialPlanificacion.prototype, "planificacionDia", void 0);
HistorialPlanificacion = __decorate([
    Entity({ name: 'historialPlanificaciones' })
], HistorialPlanificacion);
export { HistorialPlanificacion };
//# sourceMappingURL=historialPlanificacionDia.entity.js.map