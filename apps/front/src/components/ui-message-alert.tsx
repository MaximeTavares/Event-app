import { AlertCircle, Info, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UiMessage } from '@/shared/utils/map/mapUiMessages';

type UiMessageAlertProps = {
    message: UiMessage;
    className?: string;
};

const severityStyles = {
    info: 'border-border bg-muted text-muted-foreground',
    warning:
        'border-amber-500/40 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200',
    error: 'border-destructive/40 bg-destructive/10 text-destructive',
} as const;

const severityIcons = {
    info: Info,
    warning: TriangleAlert,
    error: AlertCircle,
} as const;

export default function UiMessageAlert({ message, className }: Readonly<UiMessageAlertProps>) {
    if (!message) return null;

    const Icon = severityIcons[message.severity];

    return (
        <div
            role={message.severity === 'error' ? 'alert' : 'status'}
            className={cn(
                'flex items-center gap-2 rounded-md border px-3 py-2 text-sm',
                severityStyles[message.severity],
                className,
            )}
        >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            <span className="whitespace-pre-line">{message.text}</span>
        </div>
    );
}
