import { ParticipantDetailsDto, participationStatusLabel } from '@app/contracts';
import Button from '../../../shared/components/UI/Button';
import { UserInfo } from './UserInfo';

type HandleParticipantItemProps = {
    participations: ParticipantDetailsDto[];
    isFull: boolean;
};

export function HandleParticipantItem({
    participations,
    isFull,
}: Readonly<HandleParticipantItemProps>) {
    return (
        <ul className="flex flex-col gap-2">
            {participations.map((p) => (
                <li key={p.id} className="p-2 rounded-lg border bg-gray-50 flex flex-col gap-2">
                    <div className="flex justify-between">
                        {/* USER INFO */}
                        <UserInfo
                            user={{
                                firstname: p.first_name,
                                lastname: p.last_name,
                                email: p.email,
                            }}
                        />

                        {/* STATUS */}
                        <span
                            className={`self-start justify-self-end text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${
                                p.status === 'ACCEPTED'
                                    ? 'bg-secondary text-white'
                                    : 'bg-warning text-white'
                            }`}
                        >
                            {participationStatusLabel[p.status]}
                        </span>
                    </div>

                    {/* BUTTON */}
                    <div className="flex justify-end gap-1">
                        <Button size="sm" disabled={p.status === 'ACCEPTED' || isFull}>
                            Accepter
                        </Button>

                        <Button variant="warning" size="sm" disabled={p.status === 'ACCEPTED'}>
                            Refuser
                        </Button>

                        <Button variant="error" size="sm" disabled={p.status === 'PENDING'}>
                            Annuler
                        </Button>
                    </div>
                </li>
            ))}
        </ul>
    );
}
