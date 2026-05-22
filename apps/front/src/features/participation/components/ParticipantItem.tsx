import type { ParticipationFromSlotDetails } from '../types/participation.types';

type ParticipantItemProps = {
    participations: ParticipationFromSlotDetails;
    canEdit: boolean;
    emptyMessage: string;
};

export function ParticipantItem({
    participations,
    canEdit,
    emptyMessage,
}: Readonly<ParticipantItemProps>) {
    return (
        <div className="border rounded-2xl p-4 shadow-sm bg-white space-y-3">
            {participations.length === 0 ? (
                <p className="text-sm text-gray-500 italic">{emptyMessage}</p>
            ) : (
                <ul className="flex gap-2">
                    {participations.map((p) => (
                        <li
                            key={p.id}
                            className="flex items-center justify-between gap-2 p-2 rounded-lg border bg-gray-50"
                        >
                            <div className="flex flex-col">
                                <span className="font-medium">
                                    {p.first_name} {canEdit && <span>{p.last_name}</span>}
                                </span>
                                {canEdit && (
                                    <span className="text-xs text-gray-500">{p.email}</span>
                                )}
                            </div>

                            <span
                                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                    p.participation_status === 'ACCEPTED'
                                        ? 'bg-secondary text-white'
                                        : 'bg-warning text-white'
                                }`}
                            >
                                {p.participation_status}
                            </span>
                        </li>
                    ))}
                </ul>
            )}

            {canEdit && (
                <div className="pt-2">
                    <button className="text-sm text-blue-600 hover:underline">
                        Gérer les participants
                    </button>
                </div>
            )}
        </div>
    );
}
