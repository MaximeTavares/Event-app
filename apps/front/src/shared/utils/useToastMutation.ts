import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import type { ApiError } from "../../features/event/components/EventCreationPage";

export async function toastMutation<T>(
	promise: Promise<T>,
	options: {
		loading: string;
		success: string;
		error?: string;
	},
) {
	return toast.promise(promise, {
		loading: options.loading,
		success: options.success,
		error: (err: AxiosError<ApiError>) => {
			return err.response?.data.message || options.error || "Erreur";
		},
	});
}
