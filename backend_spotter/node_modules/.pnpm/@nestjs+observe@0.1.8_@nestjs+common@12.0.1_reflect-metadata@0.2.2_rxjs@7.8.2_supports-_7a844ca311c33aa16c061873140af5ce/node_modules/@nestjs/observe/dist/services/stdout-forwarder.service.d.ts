import { OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";
import { ObserveAgentSharedBuffer } from "../agent/observe-agent.shared-buffer.js";
import { ObserveModuleOptionsWithDefaults } from "../interfaces/index.js";
export declare class StdoutForwarderService implements OnModuleInit, OnModuleDestroy {
    private readonly options;
    private readonly observeAgentSharedBuffer;
    private readonly als;
    private readonly logger;
    /**
     * stdout arrives in chunks, not lines: a single write can carry half a line,
     * several lines, or a line split across two calls. Parsing a chunk directly
     * would mangle every log that straddles a boundary, so the trailing fragment
     * is held here until its newline shows up.
     */
    private partialLine;
    private originalWrite;
    /**
     * Null only when redaction has been switched off explicitly. Defaulting to on
     * matters more here than anywhere else in the agent: enabling `forwardLogs`
     * moves every log line onto another machine, and the failure mode of getting
     * it wrong is a credential in someone else's database.
     */
    private readonly redactor;
    constructor(options: ObserveModuleOptionsWithDefaults, observeAgentSharedBuffer: ObserveAgentSharedBuffer, als: AsyncLocalStorage<Map<string, any>>);
    onModuleInit(): void;
    onModuleDestroy(): void;
    start(): void;
    /**
     * Restores the original stdout.write.
     *
     * Without this the patch outlives the module - which matters in tests, where
     * a torn-down app would keep pushing into a buffer nobody drains, and in any
     * process that recreates the Nest application.
     */
    private restore;
    private consume;
    private flushPartial;
    private toLogEntry;
}
