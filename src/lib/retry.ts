type RetryableError = Error & {
    retryable?: boolean;
    statusCode?: number;
};

const inFlightOperations = new Map<string, Promise<unknown>>();
const completedOperations = new Map<string, { kind: "resolved"; value: unknown } | { kind: "rejected"; error: unknown }>();

function isRetryableError(error: unknown): boolean {
    if (error instanceof Error && "retryable" in error) {
        return Boolean((error as RetryableError).retryable);
    }

    if (error instanceof Error) {
        const message = error.message.toLowerCase();
        return message.includes("fetch failed")
            || message.includes("network")
            || message.includes("timeout")
            || message.includes("econnreset")
            || message.includes("eai_again")
            || message.includes("temporarily unavailable")
            || message.includes("429")
            || message.includes("5") || message.includes("502") || message.includes("503") || message.includes("504");
    }

    return false;
}

function shouldRetry(error: unknown, attempt: number, maxAttempts: number): boolean {
    if (attempt >= maxAttempts) return false;

    if (error instanceof Error && "statusCode" in error) {
        const code = (error as RetryableError).statusCode;
        if (code && code >= 400 && code < 500 && code !== 429) {
            return false;
        }
    }

    return isRetryableError(error);
}

export async function runWithRetry<T>(
    operation: () => Promise<T>,
    options: {
        maxAttempts?: number;
        baseDelayMs?: number;
        maxDelayMs?: number;
        shouldRetry?: (error: unknown, attempt: number, maxAttempts: number) => boolean;
        onRetry?: (error: unknown, attempt: number, delayMs: number) => void;
    } = {}
): Promise<T> {
    const maxAttempts = options.maxAttempts ?? 3;
    const baseDelayMs = options.baseDelayMs ?? 500;
    const maxDelayMs = options.maxDelayMs ?? 4000;
    const shouldRetryFn = options.shouldRetry ?? shouldRetry;

    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            if (!shouldRetryFn(error, attempt, maxAttempts)) {
                throw error;
            }

            const delayMs = Math.min(baseDelayMs * 2 ** (attempt - 1), maxDelayMs);
            options.onRetry?.(error, attempt, delayMs);
            await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
    }

    throw lastError instanceof Error ? lastError : new Error("Operation failed");
}

export async function runWithRetryAndIdempotency<T>(
    operationKey: string,
    operation: () => Promise<T>,
    options: {
        maxAttempts?: number;
        baseDelayMs?: number;
        maxDelayMs?: number;
        shouldRetry?: (error: unknown, attempt: number, maxAttempts: number) => boolean;
        onRetry?: (error: unknown, attempt: number, delayMs: number) => void;
    } = {}
): Promise<T> {
    const completed = completedOperations.get(operationKey);
    if (completed?.kind === "resolved") {
        return completed.value as T;
    }

    if (completed?.kind === "rejected") {
        completedOperations.delete(operationKey);
    }

    const existing = inFlightOperations.get(operationKey);
    if (existing) {
        return existing as Promise<T>;
    }

    const pending = (async () => {
        try {
            const result = await runWithRetry(operation, options);
            completedOperations.set(operationKey, { kind: "resolved", value: result });
            return result;
        } catch (error) {
            completedOperations.set(operationKey, { kind: "rejected", error });
            throw error;
        } finally {
            inFlightOperations.delete(operationKey);
        }
    })();

    inFlightOperations.set(operationKey, pending as Promise<unknown>);
    return pending;
}
