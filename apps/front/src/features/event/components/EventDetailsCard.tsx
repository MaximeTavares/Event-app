import { formatDate } from '../../../shared/utils/formatDate';
import { EventMapper } from '../mapper/EventMapper';
import { MissionItem } from '../../mission/components/MissionItem';
import { EventDto, eventStatusColor, eventStatusLabel } from '@app/contracts';
import { EventForm } from './EventForm';
import { MissionForm } from '../../mission/components/MissionForm';
import { useEventDetails } from '../hooks/useEventDetails';

// shadcn
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

// layout primitives
import { Grid } from '@/components/layout/grid';
import { Flex } from '@/components/layout/flex';

// icons
import { PencilIcon, Trash2Icon, PlusIcon } from 'lucide-react';

interface EventDetailsProps {
    event: EventDto;
}

export function EventDetailsCard({ event }: Readonly<EventDetailsProps>) {
    const {
        canEdit,
        isEditOpen,
        setIsEditOpen,
        updateMutation,
        handleUpdate,
        isCreateMissionOpen,
        setIsCreateMissionOpen,
        createMissionMutation,
        handleCreateMission,
        isDeleteOpen,
        setIsDeleteOpen,
        handleDelete,
    } = useEventDetails(event);

    return (
        <>
            <Card>
                {/* HEADER */}
                <CardHeader>
                    <Flex justify="between" align="start">
                        <div className="flex flex-col gap-1">
                            <CardTitle className="text-2xl">{event.title}</CardTitle>
                            <CardDescription>{event.description}</CardDescription>
                        </div>

                        <Flex align="center" gap="2">
                            <Badge variant="outline" className={eventStatusColor[event.status]}>
                                {eventStatusLabel[event.status]}
                            </Badge>

                            {canEdit && (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsEditOpen(true)}
                                        aria-label="Modifier l'événement"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsDeleteOpen(true)}
                                        aria-label="Supprimer l'événement"
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2Icon className="h-4 w-4" />
                                    </Button>
                                </>
                            )}
                        </Flex>
                    </Flex>
                </CardHeader>

                <CardContent className="flex flex-col gap-6">
                    <Separator />

                    {/* DATES */}
                    <section className="flex flex-col gap-1">
                        <h2 className="text-base font-semibold">Dates</h2>
                        <p className="text-sm text-muted-foreground">
                            Du {formatDate(event.start_date)} au {formatDate(event.end_date)}
                        </p>
                    </section>

                    <Separator />

                    {/* PROGRAMME */}
                    <section className="flex flex-col gap-1">
                        <h2 className="text-base font-semibold">Programme</h2>
                        <p className="text-sm text-muted-foreground">{event.program}</p>
                    </section>

                    <Separator />

                    {/* ADRESSE */}
                    <section className="flex flex-col gap-1">
                        <h2 className="text-base font-semibold">Adresse</h2>
                        <p className="text-sm text-muted-foreground">
                            {event.address.street_number} {event.address.street_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {event.address.postal_code} {event.address.city}
                        </p>
                        <p className="text-sm text-muted-foreground">{event.address.country}</p>
                    </section>

                    <Separator />

                    {/* MISSIONS */}
                    <section className="flex flex-col gap-3">
                        <Flex justify="between" align="center">
                            <h2 className="text-base font-semibold">Missions</h2>
                            {canEdit && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsCreateMissionOpen(true)}
                                >
                                    <PlusIcon className="mr-1 h-4 w-4" />
                                    Ajouter une mission
                                </Button>
                            )}
                        </Flex>

                        {event.missions.length > 0 ? (
                            <Grid cols={2} gap="md">
                                {event.missions.map((mission) => (
                                    <MissionItem key={mission.id} mission={mission} />
                                ))}
                            </Grid>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Aucune mission pour cet événement.
                            </p>
                        )}
                    </section>
                </CardContent>
            </Card>

            {/* DIALOG — modifier l'événement */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle> </DialogTitle>
                    </DialogHeader>
                    <EventForm
                        mode="edit"
                        defaultValues={EventMapper.toFormValues(event)}
                        onSubmit={handleUpdate}
                        isSubmitting={updateMutation.isPending}
                        error={updateMutation.isError}
                    />
                </DialogContent>
            </Dialog>

            {/* DIALOG — créer une mission */}
            <Dialog open={isCreateMissionOpen} onOpenChange={setIsCreateMissionOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Créer une mission</DialogTitle>
                    </DialogHeader>
                    <MissionForm
                        onSubmit={handleCreateMission}
                        isSubmitting={createMissionMutation.isPending}
                        error={createMissionMutation.isError}
                    />
                </DialogContent>
            </Dialog>

            {/* ALERT DIALOG — confirmer la suppression */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer cet événement ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. L'événement et toutes ses missions seront
                            définitivement supprimés.
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
