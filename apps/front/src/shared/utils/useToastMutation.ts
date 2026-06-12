import type { AxiosError } from 'axios';
import toast, { ToastOptions } from 'react-hot-toast';
import type { ApiError } from '../../features/event/components/EventCreationPage';

export async function toastMutation<T>(
    promise: Promise<T>,
    message: {
        loading: string;
        success: string;
        error?: string;
    },
    options?: ToastOptions,
) {
    return toast.promise(
        promise,
        {
            loading: message.loading,
            success: message.success,
            error: (err: AxiosError<ApiError>) => {
                return err.response?.data.message || message.error || 'Erreur';
            },
        },
        options,
    );
}
