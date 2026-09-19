export declare const IsolationLevels: readonly ["READ COMMITTED", "READ UNCOMMITTED", "REPEATABLE READ", "SERIALIZABLE", "SNAPSHOT"];
export type IsolationLevel = (typeof IsolationLevels)[number];
