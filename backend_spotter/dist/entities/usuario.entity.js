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
import { Salud } from './salud.entity.js';
import { RolUsuario } from './rolUsuario.entity.js';
import { Contrato } from './contrato.entity.js';
import { Plan } from './plan.entity.js';
import { RegistroEntrenamiento } from './registroEntrenamiento.entity.js';
export var Sexo;
(function (Sexo) {
    Sexo["FEMENINO"] = "femenino";
    Sexo["MASCULINO"] = "masculino";
    Sexo["PREFIERO_NO_DECIRLO"] = "prefiero no decirlo";
})(Sexo || (Sexo = {}));
let Usuario = class Usuario {
    idUsuario;
    nombre;
    apellido;
    email;
    password;
    sexo;
    imagen;
    peso;
    altura;
    fechaNacimiento;
    salud;
    rolUsuario;
    contratosComoCliente;
    planesComoProfesor;
    registrosEntrenamiento;
};
__decorate([
    PrimaryGeneratedColumn({ name: 'idUsuario' }),
    __metadata("design:type", Number)
], Usuario.prototype, "idUsuario", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Usuario.prototype, "nombre", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Usuario.prototype, "apellido", void 0);
__decorate([
    Column({ unique: true }),
    __metadata("design:type", String)
], Usuario.prototype, "email", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Usuario.prototype, "password", void 0);
__decorate([
    Column({
        type: 'enum',
        enum: Sexo,
    }),
    __metadata("design:type", String)
], Usuario.prototype, "sexo", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Usuario.prototype, "imagen", void 0);
__decorate([
    Column({ nullable: true, type: 'float' }),
    __metadata("design:type", Number)
], Usuario.prototype, "peso", void 0);
__decorate([
    Column({ nullable: true, type: 'float' }),
    __metadata("design:type", Number)
], Usuario.prototype, "altura", void 0);
__decorate([
    Column({ type: 'date', nullable: true, name: 'fechaNacimiento' }),
    __metadata("design:type", Date)
], Usuario.prototype, "fechaNacimiento", void 0);
__decorate([
    OneToMany(() => Salud, (salud) => salud.usuario),
    __metadata("design:type", Object)
], Usuario.prototype, "salud", void 0);
__decorate([
    OneToMany(() => RolUsuario, (rolUsuario) => rolUsuario.usuario),
    __metadata("design:type", Object)
], Usuario.prototype, "rolUsuario", void 0);
__decorate([
    OneToMany(() => Contrato, (contrato) => contrato.cliente),
    __metadata("design:type", Object)
], Usuario.prototype, "contratosComoCliente", void 0);
__decorate([
    OneToMany(() => Plan, (plan) => plan.profesor),
    __metadata("design:type", Object)
], Usuario.prototype, "planesComoProfesor", void 0);
__decorate([
    OneToMany(() => RegistroEntrenamiento, (registro) => registro.usuario),
    __metadata("design:type", Object)
], Usuario.prototype, "registrosEntrenamiento", void 0);
Usuario = __decorate([
    Entity({ name: 'usuarios' })
], Usuario);
export { Usuario };
//# sourceMappingURL=usuario.entity.js.map