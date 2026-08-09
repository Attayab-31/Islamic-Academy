"use client";

import { useState } from "react";

type AvailabilityFormProps = {
    weekdayLabels: string[];
    defaultTimesByDay?: Array<{ startHour: number; startMin: number; duration: number }>;
};

const defaultTimes = [
    { startHour: 9, startMin: 0, duration: 45 },
    { startHour: 14, startMin: 0, duration: 45 },
    { startHour: 9, startMin: 0, duration: 45 },
    { startHour: 9, startMin: 0, duration: 45 },
    { startHour: 9, startMin: 0, duration: 45 },
    { startHour: 9, startMin: 0, duration: 45 },
    { startHour: 9, startMin: 0, duration: 45 },
];

export function AvailabilityForm({ weekdayLabels, defaultTimesByDay = defaultTimes }: AvailabilityFormProps) {
    const [selectedDays, setSelectedDays] = useState<number[]>([]);

    const toggleDay = (dayIndex: number) => {
        setSelectedDays((current) => {
            if (current.includes(dayIndex)) {
                return current.filter((item) => item !== dayIndex);
            }

            return [...current, dayIndex].sort((left, right) => left - right);
        });
    };

    return (
        <div className="space-y-4">
            <div className="rounded-lg border border-border bg-background/60 p-3">
                <div className="mb-2 text-sm font-medium text-foreground">Select days</div>
                <div className="flex flex-wrap gap-2">
                    {weekdayLabels.map((label, dayIndex) => (
                        <label key={label} className="flex items-center gap-2 rounded border border-border bg-background px-3 py-2 text-sm">
                            <input
                                type="checkbox"
                                name="selectedDays"
                                value={dayIndex.toString()}
                                checked={selectedDays.includes(dayIndex)}
                                onChange={() => toggleDay(dayIndex)}
                                className="h-4 w-4"
                            />
                            <span>{label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="rounded-lg border border-border bg-background/60 p-3">
                <div className="mb-2 text-sm font-medium text-foreground">Set time for each selected day</div>
                {selectedDays.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Choose one or more days above to add the time and duration for that slot.</p>
                ) : (
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {selectedDays.map((dayIndex) => {
                            const defaults = defaultTimesByDay[dayIndex] ?? defaultTimes[dayIndex] ?? defaultTimes[0];
                            return (
                                <label key={dayIndex} className="space-y-1 rounded border border-border/70 bg-background p-2 text-xs font-medium text-muted-foreground">
                                    <span>{weekdayLabels[dayIndex]}</span>
                                    <div className="flex gap-2">
                                        <input name={`startHour_${dayIndex}`} type="number" min="0" max="23" defaultValue={defaults.startHour} placeholder="14" className="w-full rounded border border-border bg-background px-2 py-2 text-sm" />
                                        <span className="flex items-center text-sm">:</span>
                                        <input name={`startMin_${dayIndex}`} type="number" min="0" max="59" defaultValue={defaults.startMin} placeholder="00" className="w-full rounded border border-border bg-background px-2 py-2 text-sm" />
                                    </div>
                                    <input name={`duration_${dayIndex}`} type="number" min="15" step="15" defaultValue={defaults.duration} placeholder="45" className="w-full rounded border border-border bg-background px-2 py-2 text-sm" />
                                </label>
                            );
                        })}
                    </div>
                )}
                <div className="mt-3">
                    <label className="space-y-1 text-xs font-medium text-muted-foreground">
                        <span>Capacity for all selected days</span>
                        <input name="capacity" type="number" min="1" step="1" defaultValue="10" placeholder="10" className="w-full rounded border border-border bg-background px-2 py-2 text-sm md:max-w-xs" />
                    </label>
                </div>
            </div>
        </div>
    );
}
