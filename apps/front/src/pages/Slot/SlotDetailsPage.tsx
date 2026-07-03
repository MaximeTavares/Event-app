import { useParams } from 'react-router';
import { useGetSlot } from '../../features/mission_slot/hooks/use_slot.service';
import { SlotDetailsComponent } from '../../features/mission_slot/components/SlotDetails';
import { AlertColors } from '@/components/alert-colors';
import { LoadingPage } from '@/components/loading-page';

export function SlotDetailsPage() {
    const { slotId } = useParams<{ slotId: string }>();

    const { data: slot, isLoading, isError } = useGetSlot(Number(slotId));

    if (isLoading) return <LoadingPage />;

    if (isError || !slot) return <AlertColors />;

    if (slot) return <SlotDetailsComponent slot={slot} />;
}
