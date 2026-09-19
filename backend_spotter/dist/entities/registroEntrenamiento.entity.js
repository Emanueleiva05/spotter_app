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
import { Usuario } from './usuario.entity.js';
let RegistroEntrenamiento = class RegistroEntrenamiento {
    idRegistroEntrenamiento;
    fecha;
    repeticiones;
    series;
    RIR;
    RPE;
    peso;
    tonalajeTotal;
    planificacionDia;
    usuario;
};
__decorate([
    PrimaryGeneratedColumn({ name: 'idRegistroEntrenamiento' }),
    __metadata("design:type", Number)
], RegistroEntrenamiento.prototype, "idRegistroEntrenamiento", void 0);
__decorate([
    Column({ type: 'date' }),
    __metadata("design:type", Date)
], RegistroEntrenamiento.prototype, "fecha", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", Number)
], RegistroEntrenamiento.prototype, "repeticiones", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", Number)
], RegistroEntrenamiento.prototype, "series", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", Number)
], RegistroEntrenamiento.prototype, "RIR", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", Number)
], RegistroEntrenamiento.prototype, "RPE", void 0);
__decorate([
    Column({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], RegistroEntrenamiento.prototype, "peso", void 0);
__decorate([
    Column({ type: 'float', name: 'tonalajeTotal' }),
    __metadata("design:type", Number)
], RegistroEntrenamiento.prototype, "tonalajeTotal", void 0);
__decorate([
    ManyToOne(() => PlanificacionDia, (planificacion) => planificacion.registrosEntrenamiento),
    JoinColumn({ name: 'idPlanificacionDia' }),
    __metadata("design:type", Object)
], RegistroEntrenamiento.prototype, "planificacionDia", void 0);
__decorate([
    ManyToOne(() => Usuario, (usuario) => usuario.registrosEntrenamiento),
    JoinColumn({ name: 'idUsuario' }),
    __metadata("design:type", Object)
], RegistroEntrenamiento.prototype, "usuario", void 0);
RegistroEntrenamiento = __decorate([
    Entity({ name: 'registros_entrenamiento' })
], RegistroEntrenamiento);
export { RegistroEntrenamiento };
//# sourceMappingURL=registroEntrenamiento.entity.js.map