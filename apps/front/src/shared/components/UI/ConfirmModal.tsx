import Button from './Button';
import { Modal2 } from './Modal2';

type ConfirmModalProps = {
    message: string;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
};

export function ConfirmModal({
    message,
    isOpen,
    onClose,
    onConfirm,
    size,
}: Readonly<ConfirmModalProps>) {
    return (
        <Modal2 title="Confirmer la participation" isOpen={isOpen} onClose={onClose} size={size}>
            <div>
                <div className="p-2">
                    <p className=" text-gray-600 ">{message}</p>
                </div>

                <div className="flex justify-end gap-2 ">
                    <Button variant="primary" onClick={onConfirm}>
                        Je confirme mon inscription
                    </Button>
                    <Button variant="neutral" onClick={onClose}>
                        Après réfléxion...
                    </Button>
                </div>
            </div>
        </Modal2>
    );
}
