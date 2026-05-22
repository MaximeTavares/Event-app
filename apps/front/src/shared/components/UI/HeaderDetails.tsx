import Button from './Button';
import { EditPencil, TrashIcon } from './icons/icons';

type BaseEntity = {
    title?: string;
    status: string;
};

type HeaderDetailsProps<T extends BaseEntity> = {
    entity: T;
    canEdit: boolean;
    status: string;
    statusColor: Record<string, string>;
    onEdit?: () => void;
    onDelete?: () => void;
};

export function HeaderDetails<T extends BaseEntity>({
    entity,
    canEdit,
    status,
    statusColor,
    onEdit,
    onDelete,
}: Readonly<HeaderDetailsProps<T>>) {
    return (
        /* HEADER */

        <div className="grid grid-cols-3 items-center">
            {/* LEFT */}
            <div />

            {/* CENTER */}
            <div className="flex items-center justify-center gap-2">
                <h1 className="text-3xl font-bold text-primary text-center truncate">
                    {entity.title}
                </h1>
                <span className={`badge ${statusColor[entity.status]}`}>{status}</span>
            </div>

            {/* RIGHT */}
            <div className="flex justify-end gap-2">
                {canEdit && onEdit && (
                    <Button data-cy="edit-modal" variant="secondary" size="xs" onClick={onEdit}>
                        <EditPencil size={13} />
                    </Button>
                )}

                {canEdit && onDelete && (
                    <Button data-cy="delete-modal" variant="error" size="xs" onClick={onDelete}>
                        <TrashIcon size={13} />
                    </Button>
                )}
            </div>
        </div>
    );
}
