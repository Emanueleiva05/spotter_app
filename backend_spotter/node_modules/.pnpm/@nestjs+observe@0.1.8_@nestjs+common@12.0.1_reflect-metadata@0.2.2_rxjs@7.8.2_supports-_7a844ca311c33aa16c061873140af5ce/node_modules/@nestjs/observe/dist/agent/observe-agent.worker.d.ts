import { OnApplicationShutdown, OnModuleInit } from "@nestjs/common";
import { ObserveModuleOptionsWithDefaults } from "../interfaces/observe-options.interface.js";
import { NodeRuntimeMetricsService } from "../services/node-runtime-metrics.service.js";
import { ObserveAgentSharedBuffer } from "./observe-agent.shared-buffer.js";
export declare class ObserveAgentWorker implements OnModuleInit, OnApplicationShutdown {
    private readonly observeAgentSharedBuffer;
    private readonly options;
    private readonly nodeRuntimeMetricsService;
    private readonly logger;
    private worker;
    private flushInterval;
    private runtimeMetricsInterval;
    private cpuProfiler;
    constructor(observeAgentSharedBuffer: ObserveAgentSharedBuffer, options: ObserveModuleOptionsWithDefaults, nodeRuntimeMetricsService: NodeRuntimeMetricsService);
    onModuleInit(): void;
    /**
     * Starts the runtime-metrics collector: memory, CPU, GC, event loop.
     */
    private startRuntimeMetrics;
    /**
     * Starts the sampling profiler, if the application asked for it.
     *
     * Distinct from `runtimeMetrics`, which gauges how loaded the process is.
     * This one samples stacks to say which code was running, and it is the only
     * one of the two with a cost on the hot path - so it stays off unless asked
     * for, rather than following any existing flag.
     *
     * Currently unreachable: `profiling` is commented out of `ObserveOptions` and
     * the call in `onModuleInit` is commented out with it. The body is kept
     * compiling rather than deleted, so restoring the feature is uncommenting two
     * lines instead of recovering this from history. The local type below is what
     * `ObserveOptions.profiling` declared, and is the thing to delete when the
     * real option comes back.
     */
    private startContinuousProfiling;
    onApplicationShutdown(): Promise<void>;
    private get endpoint();
    /**
     * Says out loud when credentials are about to cross the network unencrypted.
     *
     * `endpoint` is free-form and both halves of the agent attach `x-api-key` /
     * `x-api-secret` to every request against it. Over `http://` to anything but
     * the local machine, those headers are readable by every hop in between -
     * a misconfiguration worth one warning, not a refusal: private networks and
     * tunnels exist, and an agent that stops reporting over a scheme choice
     * punishes the operator harder than the mistake does.
     */
    private warnIfCredentialsSentInClear;
    initializeWorker(): void;
    handleMessage(msg: string): void;
    handleError(error: Error): void;
    flush(): void;
}
