import { Subject } from "../Subject";
import type { ObjectLiteral } from "../../common/ObjectLiteral";
/**
 * Finds all cascade operations of the given subject and cascade operations of the found cascaded subjects,
 * e.g. builds a cascade tree and creates a subjects for them.
 */
export declare class CascadesSubjectBuilder {
    protected allSubjects: Subject[];
    constructor(allSubjects: Subject[]);
    /**
     * Builds a cascade subjects tree and pushes them in into the given array of subjects.
     *
     * @param subject
     * @param operationType
     */
    build(subject: Subject, operationType: "save" | "remove" | "soft-remove" | "recover"): void;
    /**
     * Finds subject where entity like given subject's entity.
     * Comparison made by entity id.
     *
     * @param entityTarget
     * @param entity
     */
    protected findByPersistEntityLike(entityTarget: Function | string, entity: ObjectLiteral): Subject | undefined;
}
