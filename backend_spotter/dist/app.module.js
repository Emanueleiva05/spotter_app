var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Usuario } from './entities/usuario.entity.js';
import { Rol } from './entities/rol.entity.js';
import { RolUsuario } from './entities/rolUsuario.entity.js';
import { Salud } from './entities/salud.entity.js';
import { Ejercicio } from './entities/ejercicio.entity.js';
import { Rutina } from './entities/rutina.entity.js';
import { Dia } from './entities/dia.entity.js';
import { RegistroEntrenamiento } from './entities/registroEntrenamiento.entity.js';
import { PlanificacionDia } from './entities/planificacionDia.entity.js';
import { Plan } from './entities/plan.entity.js';
import { Contrato } from './entities/contrato.entity.js';
export const { ObserveModule, ObserveInstrument } = createObserveModule();
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [
            ConfigModule.forRoot({
                isGlobal: true,
            }),
            TypeOrmModule.forRootAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (configService) => {
                    console.log('--- VALIDANDO VARIABLES DE ENTORNO ---');
                    console.log('DB_HOST:', configService.get('DB_HOST'));
                    console.log('DB_PASSWORD:', configService.get('DB_PASSWORD'));
                    console.log('--------------------------------------');
                    return {
                        type: 'postgres',
                        host: configService.get('DB_HOST'),
                        port: configService.get('DB_PORT', 5432),
                        username: configService.get('DB_USERNAME'),
                        password: configService.get('DB_PASSWORD'),
                        database: configService.get('DB_DATABASE'),
                        entities: [
                            Usuario,
                            Rol,
                            RolUsuario,
                            Salud,
                            Ejercicio,
                            Rutina,
                            Dia,
                            RegistroEntrenamiento,
                            PlanificacionDia,
                            Plan,
                            Contrato,
                        ],
                        autoLoadEntities: true,
                        synchronize: true,
                    };
                },
            }),
        ],
        controllers: [AppController],
        providers: [AppService],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map