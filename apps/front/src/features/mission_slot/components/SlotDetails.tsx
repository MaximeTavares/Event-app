import { useState } from 'react';
import { formatInTimeZone } from 'date-fns-tz';
import { ParticipantItem } from '../../participation/components/ParticipantItem';
import { HandleParticipantItem } from '../../participation/components/HandleParticipantItem';
import { useSlotDetails } from '../hooks/useSlotDetails';
import {
    TransitionAction,
    useParticipationTransitions,
} from '../../participation/hooks/use_participationTransition';
import { SlotDetails, SlotFormValues, slotStatusColor, slotStatusLabel } from '@app/contracts';

// shadcn
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// layout
import { Flex } from '@/components/layout/flex';

// icons
import { PencilIcon, Trash2Icon, UsersIcon, CalendarIcon } from 'lucide-react';
import { SlotForm } from './SlotForm';
import { SlotMapper } from '../mapper/SlotMapper';

type SlotDetailsProps = {
    slot: SlotDetails;
};

export function SlotDetailsComponent({ slot }: Readonly<SlotDetailsProps>) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isParticipantOpen, setIsParticipantOpen] = useState(false);

    const isFull = slot.available_place === 0;

    const {
        acceptedParticipants,
        pendingParticipants,
        canEdit,
        handleDelete,
        handleUpdate,
        updateSlotMutation,
    } = useSlotDetails(slot);

    const onUpdate = async (data: SlotFormValues) => {
        setIsEditOpen(false);
        await handleUpdate(data);
    };

    const { handleAction } = useParticipationTransitions(slot.id, slot.missionId, slot.eventId);

    const onParticipantAction = async (action: TransitionAction, participationId: number) => {
        setIsParticipantOpen(false);
        await handleAction(action, participationId);
    };

    return (
        <>
            <Card>
                {/* HEADER */}
                <CardHeader>
                    <Flex justify="between" align="start">
                        <Flex align="center" gap="2">
                            <CardTitle className="text-2xl">Créneau</CardTitle>
                            <Badge variant="outline" className={slotStatusColor[slot.status]}>
                                {slotStatusLabel[slot.status]}
                            </Badge>
                        </Flex>

                        {canEdit && (
                            <Flex align="center" gap="2" className="shrink-0">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsEditOpen(true)}
                                    aria-label="Modifier le créneau"
                                >
                                    <PencilIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsDeleteOpen(true)}
                                    aria-label="Supprimer le créneau"
                                    className="text-destructive hover:text-destructive"
                                >
                                    <Trash2Icon className="h-4 w-4" />
                                </Button>
                            </Flex>
                        )}
                    </Flex>
                </CardHeader>

                <CardContent className="flex flex-col gap-6">
                    <Separator />

                    {/* HORAIRES */}
                    <section className="flex flex-col gap-3">
                        <h2 className="text-base font-semibold">Horaires</h2>
                        <Flex align="center" gap="2" className="text-sm text-muted-foreground">
                            <CalendarIcon className="h-4 w-4 shrink-0" />
                            <span>
                                Début :{' '}
                                {formatInTimeZone(
                                    slot.start_at,
                                    'Europe/Paris',
                                    'dd/MM/yyyy à HH:mm',
                                )}
                            </span>
                        </Flex>
                        <Flex align="center" gap="2" className="text-sm text-muted-foreground">
                            <CalendarIcon className="h-4 w-4 shrink-0" />
                            <span>
                                Fin :{' '}
                                {formatInTimeZone(
                                    slot.end_at,
                                    'Europe/Paris',
                                    'dd/MM/yyyy à HH:mm',
                                )}
                            </span>
                        </Flex>
                    </section>

                    <Separator />

                    {/* PLACES */}
                    <section className="flex flex-col gap-3">
                        <h2 className="text-base font-semibold">Capacité</h2>
                        <Flex align="center" gap="2" className="text-sm text-muted-foreground">
                            <UsersIcon className="h-4 w-4 shrink-0" />
                            <span>
                                {slot.current_participants} / {slot.max_participant} participant
                                {slot.max_participant > 1 ? 's' : ''}
                                {' · '}
                                {slot.available_place} place
                                {slot.available_place > 1 ? 's' : ''} restante
                                {slot.available_place > 1 ? 's' : ''}
                            </span>
                        </Flex>
                    </section>

                    <Separator />

                    {/* PARTICIPANTS ACCEPTÉS */}
                    <section className="flex flex-col gap-3">
                        <h2 className="text-base font-semibold">Participants</h2>
                        <ParticipantItem
                            participations={acceptedParticipants}
                            canEdit={canEdit}
                            emptyMessage="Aucun participant pour l'instant."
                        />
                    </section>

                    {/* DEMANDES EN ATTENTE — visible uniquement par l'organisateur */}
                    {canEdit && (
                        <>
                            <Separator />
                            <section className="flex flex-col gap-3">
                                <Flex justify="between" align="center">
                                    <h2 className="text-base font-semibold">Demandes en attente</h2>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsParticipantOpen(true)}
                                    >
                                        Gérer les participants
                                    </Button>
                                </Flex>
                                <ParticipantItem
                                    participations={pendingParticipants}
                                    canEdit={canEdit}
                                    emptyMessage="Aucune demande en attente."
                                />
                            </section>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* DIALOG — modifier le créneau */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Modifier le créneau</DialogTitle>
                    </DialogHeader>
                    <SlotForm
                        onSubmit={onUpdate}
                        isSubmitting={updateSlotMutation.isPending}
                        error={updateSlotMutation.isError}
                        defaultValues={SlotMapper.toDefaultValues(slot)}
                    />
                </DialogContent>
            </Dialog>

            {/* DIALOG — gérer les participants */}
            <Dialog open={isParticipantOpen} onOpenChange={setIsParticipantOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Gestion des participants</DialogTitle>
                    </DialogHeader>
                    <HandleParticipantItem
                        participations={slot.participants}
                        isFull={isFull}
                        onAction={onParticipantAction}
                    />
                </DialogContent>
            </Dialog>

            {/* ALERT DIALOG — confirmer la suppression */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer ce créneau ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. Le créneau et toutes les participations
                            associées seront définitivement supprimés.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
