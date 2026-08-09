import test from 'node:test';
import assert from 'node:assert/strict';
import { parseRecurringSlots } from '../src/lib/availability';

test('parses multiple recurring weekly slots from simple text', () => {
    const parsed = parseRecurringSlots(`Mon 14:00-15:00
Tue 15:00-16:00 capacity:8
Thu 14:00-15:00
Wed 17:00-18:00`);

    assert.deepEqual(parsed, [
        { dayOfWeek: 1, startHour: 14, startMin: 0, duration: 60, capacity: 10 },
        { dayOfWeek: 2, startHour: 15, startMin: 0, duration: 60, capacity: 8 },
        { dayOfWeek: 4, startHour: 14, startMin: 0, duration: 60, capacity: 10 },
        { dayOfWeek: 3, startHour: 17, startMin: 0, duration: 60, capacity: 10 },
    ]);
});

test('supports meridiem shorthand and default capacity', () => {
    const parsed = parseRecurringSlots('Mon 2pm-3pm');

    assert.deepEqual(parsed, [
        { dayOfWeek: 1, startHour: 14, startMin: 0, duration: 60, capacity: 10 },
    ]);
});
