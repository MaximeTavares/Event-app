import { useNavigate } from 'react-router';
import { SlotItem } from '../../mission_slot/components/SlotItem';
import { MissionDetailsDto, missionStatusColor, missionStatusLabel } from '@app/contracts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/layout/flex';
import { ArrowRightIcon } from 'lucide-react';

type MissionItemProps = {
    mission: MissionDetailsDto;
};

export function MissionItem({ mission }: Readonly<MissionItemProps>) {
    const navigate = useNavigate();

    return (
        <Card className="group transition-shadow hover:shadow-sm">
            <CardHeader className="pb-3">
                <Flex justify="between" align="start">
                    <Flex align="center" gap="2" className="min-w-0">
                        <CardTitle className="truncate text-base">{mission.title}</CardTitle>
                        <Badge variant="outline" className={missionStatusColor[mission.status]}>
                            {missionStatusLabel[mission.status]}
                        </Badge>
                    </Flex>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => navigate(`/missions/${mission.id}`)}
                        aria-label="Voir le détail de la mission"
                    >
                        <ArrowRightIcon className="h-4 w-4" />
                    </Button>
                </Flex>

                <p className="text-sm text-muted-foreground">{mission.description}</p>
            </CardHeader>

            {mission.slots.length > 0 && (
                <CardContent className="flex flex-col gap-3">
                    {mission.slots.map((s) => (
                        <SlotItem
                            key={s.id}
                            slot={s}
                            eventId={mission.event_id}
                            missionId={mission.id}
                        />
                    ))}
                </CardContent>
            )}
        </Card>
    );
}
