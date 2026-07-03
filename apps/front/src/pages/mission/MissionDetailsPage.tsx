import { useParams } from 'react-router';
import { MissionDetails } from '../../features/mission/components/MissionDetails';
import { useGetMissionById } from '../../features/mission/hooks/use_mission.service';
import { AlertColors } from '@/components/alert-colors';
import { LoadingPage } from '@/components/loading-page';

export function MissionDetailsPage() {
    const { missionId } = useParams<{ missionId: string }>();

    const { data: mission, isLoading, isError } = useGetMissionById(Number(missionId));

    if (isLoading) return <LoadingPage />;

    if (isError || !mission) return <AlertColors />;

    return <MissionDetails mission={mission} />;
}
