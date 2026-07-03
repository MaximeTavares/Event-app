import { Spinner } from './ui/spinner';

export function LoadingPage() {
    return (
        <div className="flex flex-1 items-center justify-center">
            <Spinner className="size-8" />
        </div>
    );
}
