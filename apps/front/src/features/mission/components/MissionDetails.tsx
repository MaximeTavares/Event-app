import { useState } from 'react';
import { SlotItem } from '../../mission_slot/components/SlotItem';
import { MissionForm } from './MissionForm';
import { useMissionDetails } from '../hooks/useMissionDetails';
import {
    MissionCreationFormValues,
    MissionDetailsDto,
    missionStatusColor,
    missionStatusLabel,
    SlotFormValues,
} from '@app/contracts';

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
import { PencilIcon, Trash2Icon, PlusIcon } from 'lucide-react';
import { SlotForm } from '@/features/mission_slot/components/SlotForm';

type MissionDetailsProps = {
    mission: MissionDetailsDto;
};

export function MissionDetails({ mission }: Readonly<MissionDetailsProps>) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isCreateSlotOpen, setIsCreateSlotOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const { canEdit, handleDelete, handleUpdateMission, handleSlotSubmit, createSlot } =
        useMissionDetails(mission);

    const onCreateSlot = async (data: SlotFormValues) => {
        setIsCreateSlotOpen(false);
        await handleSlotSubmit(data);
    };

    const onEditMission = async (data: MissionCreationFormValues) => {
        setIsEditOpen(false);
        await handleUpdateMission(data);
    };

    return (
        <>
            <Card>
                {/* HEADER */}
                <CardHeader>
                    <Flex justify="between" align="start">
                        <Flex direction="column" gap="2" className="min-w-0">
                            <Flex align="center" gap="2">
                                <CardTitle className="text-2xl">{mission.title}</CardTitle>
                                <Badge
                                    variant="outline"
                                    className={missionStatusColor[mission.status]}
                                >
                                    {missionStatusLabel[mission.status]}
                                </Badge>
                            </Flex>
                            <p className="text-sm text-muted-foreground">{mission.description}</p>
                        </Flex>

                        {canEdit && (
                            <Flex align="center" gap="2" className="shrink-0">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsEditOpen(true)}
                                    aria-label="Modifier la mission"
                                >
                                    <PencilIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsDeleteOpen(true)}
                                    aria-label="Supprimer la mission"
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

                    {/* CRÉNEAUX */}
                    <section className="flex flex-col gap-3">
                        <Flex justify="between" align="center">
                            <h2 className="text-base font-semibold">Créneaux</h2>
                            {canEdit && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsCreateSlotOpen(true)}
                                >
                                    <PlusIcon className="mr-1 h-4 w-4" />
                                    Ajouter un créneau
                                </Button>
                            )}
                        </Flex>

                        {mission.slots.length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {mission.slots.map((s) => (
                                    <SlotItem
                                        key={s.id}
                                        slot={s}
                                        eventId={mission.event_id}
                                        missionId={mission.id}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Aucun créneau pour cette mission.
                            </p>
                        )}
                    </section>
                </CardContent>
            </Card>

            {/* DIALOG — modifier la mission */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Modifier la mission</DialogTitle>
                    </DialogHeader>
                    <MissionForm
                        mode="edit"
                        defaultValues={{
                            title: mission.title,
                            description: mission.description,
                            status: mission.status,
                        }}
                        onSubmit={onEditMission}
                        isSubmitting={
                            /* updateMission isPending vient du hook, on délègue */
                            false
                        }
                    />
                </DialogContent>
            </Dialog>

            {/* DIALOG — créer un créneau */}
            <Dialog open={isCreateSlotOpen} onOpenChange={setIsCreateSlotOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Créer un créneau</DialogTitle>
                    </DialogHeader>
                    <SlotForm
                        onSubmit={onCreateSlot}
                        isSubmitting={createSlot.isPending}
                        error={createSlot.isError}
                    />
                </DialogContent>
            </Dialog>

            {/* ALERT DIALOG — confirmer la suppression */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer cette mission ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. La mission et tous ses créneaux seront
                            définitivement supprimés.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
