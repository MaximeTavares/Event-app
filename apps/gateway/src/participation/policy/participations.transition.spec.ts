import { PARTICIPATION_TRANSITIONS } from './participations.transition';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

describe('participations.transition', () => {
    describe('ACCEPT', () => {
        it('should have correct toStatus and fromStatuses', () => {
            expect(PARTICIPATION_TRANSITIONS.ACCEPT.toStatus).toBe('ACCEPTED');
            expect(PARTICIPATION_TRANSITIONS.ACCEPT.fromStatuses).toEqual([
                'PENDING',
            ]);
        });

        it('should not throw when organizer accepts a pending participation', () => {
            const participation = {
                status: 'PENDING',
                event: { organizerId: 'organizer1' },
            } as any;

            expect(() =>
                PARTICIPATION_TRANSITIONS.ACCEPT.guard(
                    'organizer1',
                    participation,
                ),
            ).not.toThrow();
        });

        it('should throw ForbiddenException when non-organizer tries to accept', () => {
            const participation = {
                status: 'PENDING',
                event: { organizerId: 'organizer1' },
            } as any;

            expect(() =>
                PARTICIPATION_TRANSITIONS.ACCEPT.guard(
                    'someoneElse',
                    participation,
                ),
            ).toThrow(ForbiddenException);
        });

        it('should throw BadRequestException when status is not PENDING', () => {
            const participation = {
                status: 'ACCEPTED',
                event: { organizerId: 'organizer1' },
            } as any;

            expect(() =>
                PARTICIPATION_TRANSITIONS.ACCEPT.guard(
                    'organizer1',
                    participation,
                ),
            ).toThrow(BadRequestException);
        });

        it('decision_at should return a Date, cancelled_at should return null', () => {
            expect(
                PARTICIPATION_TRANSITIONS.ACCEPT.decision_at(),
            ).toBeInstanceOf(Date);
            expect(PARTICIPATION_TRANSITIONS.ACCEPT.cancelled_at()).toBeNull();
        });
    });

    describe('CANCEL', () => {
        it('should allow the owner to cancel a pending participation', () => {
            const participation = { status: 'PENDING', userId: 'user1' } as any;

            expect(() =>
                PARTICIPATION_TRANSITIONS.CANCEL.guard('user1', participation),
            ).not.toThrow();
        });

        it('should throw ForbiddenException when non-owner tries to cancel', () => {
            const participation = { status: 'PENDING', userId: 'user1' } as any;

            expect(() =>
                PARTICIPATION_TRANSITIONS.CANCEL.guard(
                    'someoneElse',
                    participation,
                ),
            ).toThrow(ForbiddenException);
        });

        it('cancelled_at should return a Date, decision_at should return null', () => {
            expect(
                PARTICIPATION_TRANSITIONS.CANCEL.cancelled_at(),
            ).toBeInstanceOf(Date);
            expect(PARTICIPATION_TRANSITIONS.CANCEL.decision_at()).toBeNull();
        });
    });
});
