export interface Mission {
    id: number;
    event_id: number;
    title: string;
    description: string;
    status: MissionStatus;
    created_at: Date;
    updated_at: Date | null;
}

export type MissionStatus = 'OPEN' | 'FULL' | 'COMPLETED';
