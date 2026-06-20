export const queryKeys = {
    events: ['events'] as const,
    event: (id: number) => ['events', id] as const,

    missions: ['missions'] as const,
    mission: (id: number) => ['missions', id] as const,

    slots: ['slots'] as const,
    slot: (id: number) => ['slots', id] as const,

    participationsBySlot: (slotId: number) => ['participations', 'slot', slotId] as const,
};
