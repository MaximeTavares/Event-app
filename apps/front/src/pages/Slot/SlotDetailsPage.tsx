import { useParams } from 'react-router';
import { useGetSlot } from '../../features/mission_slot/hooks/use_slot.service';
import { SlotDetails } from '../../features/mission_slot/components/SlotDetails';
import { ErrorAlert } from '../../shared/components/UI/states/ErrorAlert';
import { SkeletonLoading } from '../../shared/components/UI/states/SkeletonLoading';

export function SlotDetailsPage() {
    const { slotId } = useParams<{ slotId: string }>();

    const { data: slot, isLoading, isError } = useGetSlot(Number(slotId));

    if (isLoading) return <SkeletonLoading />;

    if (isError) return <ErrorAlert message={"Cette ressource n'existe pas."} />;

    if (slot) return <SlotDetails slot={slot} />;
}
