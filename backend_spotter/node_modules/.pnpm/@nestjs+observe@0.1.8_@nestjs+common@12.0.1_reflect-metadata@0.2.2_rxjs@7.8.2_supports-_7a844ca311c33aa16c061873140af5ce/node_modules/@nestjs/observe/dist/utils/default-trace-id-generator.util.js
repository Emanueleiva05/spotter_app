import { randomUUID } from "crypto";
/**
 * What an inbound `x-request-id` must look like to be adopted as the trace id.
 *
 * The header is client-supplied, so it is honoured only when it is a single,
 * short, unambiguous token. Anything else - an array (Node folds repeated
 * headers into one), an oversized value, control characters, exotic symbols -
 * falls back to a random id: the header exists to let a proxy correlate its
 * own logs with a trace, not to let an arbitrary caller choose what gets
 * written into the telemetry store, collide with an existing trace, or inflate
 * a row with an unbounded value.
 */
const REQUEST_ID_PATTERN = /^[A-Za-z0-9._:-]{1,128}$/;
export function defaultTraceIdGenerator(req) {
    if (typeof req === "object" && req !== null && "headers" in req) {
        const requestId = req.headers["x-request-id"];
        if (typeof requestId === "string" && REQUEST_ID_PATTERN.test(requestId)) {
            return requestId;
        }
    }
    return randomUUID();
}
