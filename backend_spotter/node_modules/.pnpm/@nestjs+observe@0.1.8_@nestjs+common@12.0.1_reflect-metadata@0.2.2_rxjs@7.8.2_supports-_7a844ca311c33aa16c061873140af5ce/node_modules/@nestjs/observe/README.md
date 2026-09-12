<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/v/@nestjs/common.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/l/@nestjs/common.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
  <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>

## Description

`@nestjs/observe` is an observability module for [NestJS](https://nestjs.com) applications. It instruments HTTP, GraphQL, microservice (RPC), BullMQ queue handlers, and `@nestjs/schedule` cron/interval/timeout jobs, collects traces, runtime metrics, custom metrics, and CPU profiles, and ships them to a collector from a detached worker thread so the request path stays untouched.

```bash
$ npm install @nestjs/observe
```

## Getting credentials

Sign up at **[observe.nestjs.com](https://observe.nestjs.com)** and create a
service. The dashboard issues an **app key** and an **app secret**, which the
agent sends on every ingest request.

**Free for up to 300,000 events a month**, which covers most individual projects, startups, and small applications.

The secret is shown once and is not retrievable afterwards - store it with the
rest of your secrets and supply both from the environment:

```bash
OBSERVE_APP_KEY=...
OBSERVE_APP_SECRET=...
```

Without valid credentials the collector answers `401` and telemetry is dropped.

## Quick start

`createObserveModule()` returns both the dynamic module and the instrumentation
hook Nest needs at bootstrap:

```ts
// observe.ts
import { createObserveModule } from "@nestjs/observe";

export const { ObserveModule, ObserveInstrument } = createObserveModule();
```

```ts
// app.module.ts
import { Module } from "@nestjs/common";
import { ObserveModule } from "./observe";

@Module({
  imports: [
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY,
      appSecret: process.env.OBSERVE_APP_SECRET,
      serviceId: "my-service",
    }),
  ],
})
export class AppModule {}
```

```ts
// main.ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ObserveInstrument } from "./observe";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  await app.listen(3000);
}
bootstrap();
```

### Async configuration

`ObserveModule.forRootAsync()` resolves the options from the DI container, via
`useFactory`, `useClass`, or `useExisting`:

```ts
ObserveModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    appKey: config.getOrThrow("OBSERVE_APP_KEY"),
    appSecret: config.getOrThrow("OBSERVE_APP_SECRET"),
    serviceId: config.getOrThrow("OBSERVE_SERVICE_ID"),
  }),
});
```

`useClass` and `useExisting` take a class implementing `ObserveOptionsFactory`:

```ts
@Injectable()
export class ObserveConfig implements ObserveOptionsFactory {
  createObserveOptions(): ObserveOptions {
    return { appKey: "...", appSecret: "...", serviceId: "..." };
  }
}
```

## Optional peer dependencies

Protocol integrations are only loaded when you use them, and their packages are optional peers:

- `@nestjs/microservices` - RPC/microservice instrumentation
- `@nestjs/graphql` - GraphQL operation instrumentation
- `@nestjs/bullmq` and `bullmq` - queue/job instrumentation
- `@nestjs/schedule` - scheduled job (`@Cron`, `@Interval`, `@Timeout`) instrumentation

## Test

```bash
# unit tests
$ npm test

# integration tests (boot real Nest apps on real ports)
$ npm run test:int
```

## Module format

The package ships as ESM only. CommonJS consumers can still `require()` it
through Node's `require(esm)` support, which is why the engine floor is
**Node 20.19** (or 22.12) rather than 20.0 - and why nothing in the module graph
uses top-level await, which `require(esm)` cannot load.

```js
// works from CommonJS on Node >= 20.19
const { createObserveModule } = require("@nestjs/observe");
```

## Stay in touch

- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
