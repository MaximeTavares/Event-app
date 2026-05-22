import { useParams } from 'react-router';
import { MissionDetails } from '../../features/mission/components/MissionDetails';
import { useGetMissionById } from '../../features/mission/hooks/use_mission.service';

export function MissionDetailsPage() {
    const { missionId } = useParams<{ missionId: string }>();

    const { data: mission, isLoading, isError } = useGetMissionById(Number(missionId));

    if (isLoading) return <p>is Loading...</p>;

    if (isError || !mission) return <p>Error...</p>;

    return <MissionDetails mission={mission} />;
}
