import test from "node:test";
import assert from "node:assert/strict";
import { runWithRetryAndIdempotency } from "../src/lib/retry";

test("runWithRetryAndIdempotency reuses a successful result for the same key", async () => {
    let calls = 0;

    const first = await runWithRetryAndIdempotency("sample-key", async () => {
        calls += 1;
        return { value: calls };
    });

    const second = await runWithRetryAndIdempotency("sample-key", async () => {
        calls += 1;
        return { value: calls };
    });

    assert.deepEqual(first, { value: 1 });
    assert.deepEqual(second, { value: 1 });
    assert.equal(calls, 1);
});
