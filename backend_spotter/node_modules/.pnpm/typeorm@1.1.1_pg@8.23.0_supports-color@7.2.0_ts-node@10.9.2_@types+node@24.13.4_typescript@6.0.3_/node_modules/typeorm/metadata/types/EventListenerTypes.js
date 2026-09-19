"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventListenerTypes = void 0;
/**
 * Provides a constants for each entity listener type.
 */
class EventListenerTypes {
    static { this.AFTER_LOAD = "after-load"; }
    static { this.BEFORE_INSERT = "before-insert"; }
    static { this.AFTER_INSERT = "after-insert"; }
    static { this.BEFORE_UPDATE = "before-update"; }
    static { this.AFTER_UPDATE = "after-update"; }
    static { this.BEFORE_REMOVE = "before-remove"; }
    static { this.AFTER_REMOVE = "after-remove"; }
    static { this.BEFORE_SOFT_REMOVE = "before-soft-remove"; }
    static { this.AFTER_SOFT_REMOVE = "after-soft-remove"; }
    static { this.BEFORE_RECOVER = "before-recover"; }
    static { this.AFTER_RECOVER = "after-recover"; }
}
exports.EventListenerTypes = EventListenerTypes;
//# sourceMappingURL=EventListenerTypes.js.map