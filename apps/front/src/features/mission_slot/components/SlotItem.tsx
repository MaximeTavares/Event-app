import { formatInTimeZone } from "date-fns-tz";
import { slotStatusColor, slotStatusLabel, type SlotFromEventDetails } from "../types/slot.type";
import { Link } from "react-router";

type SlotItemProps = {
	slot: SlotFromEventDetails;
};

export function SlotItem({ slot }: Readonly<SlotItemProps>) {
	return (
		<Link to={`/slots/${slot.id}`}>
			<div className="p-2 border border-primary rounded-md">
				<span className={`badge ${slotStatusColor[slot.status]}`}>
					{slotStatusLabel[slot.status]}
				</span>

				<p className="mt-1 text-sm">
					De {formatInTimeZone(slot.start_at, "Europe/Paris", "HH:mm")} à{" "}
					{formatInTimeZone(slot.end_at, "Europe/Paris", "HH:mm")}
				</p>

				<p className="text-sm text-gray-500">
					{slot.current_participants} inscrits · {slot.available_place} places restantes
				</p>
			</div>
		</Link>
	);
}
