import test from 'node:test';
import assert from 'node:assert/strict';
import { collectAvailabilitySlotInputs, findConflictingSlots } from '../src/lib/availability';

test('detects overlapping slots on the same day for the same teacher', () => {
    const existing = [
        { dayOfWeek: 1, startHour: 14, startMin: 0, duration: 60 },
        { dayOfWeek: 2, startHour: 15, startMin: 0, duration: 60 },
    ];

    const proposed = [
        { dayOfWeek: 1, startHour: 14, startMin: 30, duration: 60 },
    ];

    assert.equal(findConflictingSlots(existing, proposed).length, 1);
});

test('allows non-overlapping slots on different days or different times', () => {
    const existing = [
        { dayOfWeek: 1, startHour: 14, startMin: 0, duration: 60 },
    ];

    const proposed = [
        { dayOfWeek: 2, startHour: 14, startMin: 0, duration: 60 },
        { dayOfWeek: 1, startHour: 15, startMin: 0, duration: 30 },
    ];

    assert.equal(findConflictingSlots(existing, proposed).length, 0);
});

test('collects per-day availability inputs for each selected day', () => {
    const selectedDays = ['1', '3'];
    const values = {
        startHour_1: '14',
        startMin_1: '30',
        duration_1: '45',
        startHour_3: '9',
        startMin_3: '0',
        duration_3: '60',
    } as Record<string, string | undefined>;

    assert.deepEqual(collectAvailabilitySlotInputs(selectedDays, values), [
        { dayOfWeek: 1, startHour: 14, startMin: 30, duration: 45 },
        { dayOfWeek: 3, startHour: 9, startMin: 0, duration: 60 },
    ]);
});
