import { Configuration } from '../configuration/index.js';
import { AssetsManager } from './assets-manager.js';
import { BaseCompiler } from './base-compiler.js';
import { PluginsLoader } from './plugins/plugins-loader.js';
import type webpack from 'webpack';
type WebpackConfigFactory = (config: webpack.Configuration, webpackRef: typeof webpack) => webpack.Configuration;
type WebpackConfigFactoryOrConfig = WebpackConfigFactory | webpack.Configuration;
type WebpackCompilerExtras = {
    options: Record<string, any>;
    assetsManager: AssetsManager;
    webpackConfigFactoryOrConfig: WebpackConfigFactoryOrConfig | WebpackConfigFactoryOrConfig[];
    debug?: boolean;
    watchMode?: boolean;
};
export declare class WebpackCompiler extends BaseCompiler<WebpackCompilerExtras> {
    constructor(pluginsLoader: PluginsLoader);
    run(configuration: Required<Configuration>, tsConfigPath: string, appName: string | undefined, extras: WebpackCompilerExtras, onSuccess?: () => void): void;
    private createAfterCallback;
}
export {};
