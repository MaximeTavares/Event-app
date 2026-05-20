import { format } from "date-fns";

export function formatDate(date: string | Date | undefined | null) {
	if (!date) return "Date inconnue";

	const d = new Date(date);

	if (Number.isNaN(d.getTime())) return "Date invalide";

	return new Intl.DateTimeFormat("fr-FR").format(d);
}

export function toDateInputValue(date?: Date | string) {
	if (!date) return undefined;

	const d = new Date(date);
	return d.toISOString().split("T")[0];
}

export function formatForInput(date: string | Date) {
	return format(new Date(date), "yyyy-MM-dd'T'HH:mm");
}
