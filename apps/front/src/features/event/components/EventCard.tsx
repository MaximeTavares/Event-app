import Button from "../../../shared/components/UI/Button";
import { formatDate } from "../../../shared/utils/formatDate";
import type { BaseEvent } from "../types/event.type";
import { GrMap, GrSchedule, GrFavorite } from "react-icons/gr";
import { Link } from "react-router";

interface IEventComponent {
	eventData: BaseEvent;
}

const EventCard = ({ eventData }: IEventComponent) => {
	return (
		<div className="card bg-base-100 w-96 card-border border-primary shadow-xl shadow-primary">
			<div className="card-body items-start text-center">
				<div className="card-actions w-full justify-end gap-8">
					<Button size="xs" circle disabled>
						<GrFavorite className="my-1.5 inline-block size-4" />
					</Button>
				</div>
				<h2 className="card-title gap-8">{eventData.title}</h2>
				<div className="card-body">
					<p>{eventData.description}</p>
					<div className="flex gap-2">
						<GrSchedule className="my-1.5 size-5" />
						<span>
							Du {formatDate(eventData.start_date)} au{" "}
							{formatDate(eventData.end_date)}
						</span>
					</div>
					<div className="flex gap-2">
						<GrMap className="my-1.5 size-5" />
						<span>
							{eventData.address?.postal_code} {eventData.address?.city}
						</span>
					</div>
				</div>
				<div className="card-actions">
					<Button as={Link} to={`/events/${eventData.id}`} variant="ghost">
						Voir Plus
					</Button>
					<Button variant="primary" disabled>
						S'inscrire à l'évènement
					</Button>
				</div>
			</div>
		</div>
	);
};

export default EventCard;
