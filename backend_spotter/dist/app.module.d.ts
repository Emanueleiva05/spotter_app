export declare const ObserveModule: {
    new (httpAdapterHost: import("@nestjs/core").HttpAdapterHost, asyncLocalStorage: import("async_hooks").AsyncLocalStorage<Map<string, any>>, options: import("@nestjs/observe").ObserveModuleOptionsWithDefaults): {
        readonly logger: import("@nestjs/common").Logger;
        readonly httpAdapterHost: import("@nestjs/core").HttpAdapterHost;
        readonly asyncLocalStorage: import("async_hooks").AsyncLocalStorage<Map<string, any>>;
        readonly options: import("@nestjs/observe").ObserveModuleOptionsWithDefaults;
    };
    forRoot(observeOpts: import("@nestjs/observe").ObserveOptions): import("@nestjs/common").DynamicModule;
    forRootAsync(options: import("@nestjs/observe").ObserveModuleAsyncOptions): import("@nestjs/common").DynamicModule;
    createAsyncProviders(asyncOptions: import("@nestjs/observe").ObserveModuleAsyncOptions): import("@nestjs/common").Provider[];
    createAsyncOptionsProvider(asyncOptions: import("@nestjs/observe").ObserveModuleAsyncOptions): import("@nestjs/common").Provider;
}, ObserveInstrument: {
    instanceDecorator: (instance: unknown) => unknown;
} | undefined;
export declare class AppModule {
}
