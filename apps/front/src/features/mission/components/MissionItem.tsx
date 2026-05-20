import { SlotItem } from '../../mission_slot/components/SlotItem';
import {
    missionStatusColor,
    missionStatusLabel,
    type MissionFromEventDetails,
} from '../types/mission.type';
import { useNavigate } from 'react-router';
import Button from '../../../shared/components/UI/Button';
import { MoreDetailsIcon } from '../../../shared/components/UI/icons/icons';

type MissionItemProps = {
    mission: MissionFromEventDetails;
};

export function MissionItem({ mission }: Readonly<MissionItemProps>) {
    const navigate = useNavigate();
    return (
        <div className="card bg-base-100 border border-base-300 shadow-sm group hover:shadow-md transition-all duration-200 rounded-xl">
            <div className="card-body">
                {/* HEADER */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <h2 className="card-title">{mission.title}</h2>

                        <span className={`badge ${missionStatusColor[mission.status]}`}>
                            {missionStatusLabel[mission.status]}
                        </span>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/missions/${mission.id}`)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-400 hover:bg-base-200"
                    >
                        <MoreDetailsIcon size={25} />
                    </Button>
                </div>

                {/* SLOTS */}
                <div className="flex flex-col gap-3">
                    {mission.slots.map((s) => (
                        <SlotItem key={s.id} slot={s} />
                    ))}
                </div>
                <div className="card-actions justify-end"></div>
            </div>
        </div>
    );
}
