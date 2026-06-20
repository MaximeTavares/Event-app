import { ParticipantDetailsDto, participationStatusLabel } from '@app/contracts';
import Button from '../../../shared/components/UI/Button';
import { UserInfo } from './UserInfo';
import { TransitionAction } from '../hooks/use_participationTransition';

type HandleParticipantItemProps = {
    participations: ParticipantDetailsDto[];
    isFull: boolean;
    onAction: (action: TransitionAction, participationId: number) => void;
};

export function HandleParticipantItem({
    participations,
    isFull,
    onAction,
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
                        <Button
                            onClick={() => onAction('accept', p.id)}
                            size="sm"
                            disabled={p.status === 'ACCEPTED' || isFull}
                        >
                            Accepter
                        </Button>

                        <Button
                            onClick={() => onAction('reject', p.id)}
                            variant="warning"
                            size="sm"
                            disabled={p.status === 'ACCEPTED'}
                        >
                            Refuser
                        </Button>

                        <Button
                            onClick={() => onAction('cancel', p.id)}
                            variant="error"
                            size="sm"
                            disabled={p.status === 'REJECTED'}
                        >
                            Annuler
                        </Button>
                    </div>
                </li>
            ))}
        </ul>
    );
}
