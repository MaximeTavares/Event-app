import { useParams } from "react-router";
import { useGetEventById } from "../../features/event/hooks/use_event.service";
import { EventDetailsCard } from "../../features/event/components/EventDetailsCard";
import { SkeletonLoading } from "../../shared/components/UI/states/SkeletonLoading";
import { ErrorAlert } from "../../shared/components/UI/states/ErrorAlert";
import { RadioTabs } from "../../shared/components/UI/RadioTabs";
import { DiscussionIcon, DocumentsIcon, InfoIcon } from "../../shared/components/UI/icons/icons";
import { EventDiscussion } from "../../features/event/components/EventDiscussion";
import { EventDocuments } from "../../features/event/components/EventDocuments";
import { useAuthStore } from "../../features/auth/store/auth.store";

export function EventDetailsPage() {
	const { eventId } = useParams<{ eventId: string }>();
	const user = useAuthStore((state) => state.user);

	const { data: event, isLoading, isError } = useGetEventById(Number(eventId));

	if (isLoading) return <SkeletonLoading />;

	if (isError) return <ErrorAlert message={"Cette ressource n'existe pas."} />;

	if (event) {
		return (
			<div>
				{user?.role === "USER" ? (
					<RadioTabs
						tabs={[
							{
								label: "Informations",
								icon: <InfoIcon size={20} />,
								content: <EventDetailsCard event={event} />,
							},
							{
								label: "Documents",
								icon: <DocumentsIcon size={20} />,
								content: <EventDocuments />,
							},
							{
								label: "Discussion",
								icon: <DiscussionIcon size={20} />,
								content: <EventDiscussion />,
							},
						]}
						defaultTabLabel="Informations"
						name="EventDetailsTabs"
					/>
				) : (
					<RadioTabs
						tabs={[
							{
								label: "Informations",
								icon: <InfoIcon size={20} />,
								content: <EventDetailsCard event={event} />,
							},
						]}
						defaultTabLabel="Informations"
						name="EventDetailsTabs"
					/>
				)}
			</div>
		);
	}
}
