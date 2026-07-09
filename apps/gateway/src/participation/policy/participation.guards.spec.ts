/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
    assertFromStatus,
    assertOrganizer,
    assertOwner,
    assertCanCreateOrRejoin,
} from './participation.guards';
import {
    BadRequestException,
    ForbiddenException,
    ConflictException,
} from '@nestjs/common';

describe('participation.guards', () => {
    describe('assertFromStatus', () => {
        it('should not throw when status is allowed', () => {
            const participation = { status: 'PENDING' } as any;

            expect(() =>
                assertFromStatus(
                    participation,
                    ['PENDING', 'ACCEPTED'],
                    'error',
                ),
            ).not.toThrow();
        });

        it('should throw BadRequestException when status is not allowed', () => {
            const participation = { status: 'REJECTED' } as any;

            expect(() =>
                assertFromStatus(participation, ['PENDING'], 'Invalid status'),
            ).toThrow(BadRequestException);
        });
    });

    describe('assertOrganizer', () => {
        it('should not throw when userId matches organizerId', () => {
            const participation = { event: { organizerId: 'user1' } } as any;

            expect(() => assertOrganizer('user1', participation)).not.toThrow();
        });

        it('should throw ForbiddenException when userId does not match', () => {
            const participation = { event: { organizerId: 'user1' } } as any;

            expect(() => assertOrganizer('user2', participation)).toThrow(
                ForbiddenException,
            );
        });
    });

    describe('assertOwner', () => {
        it('should not throw when userId matches participation owner', () => {
            const participation = { userId: 'user1' } as any;

            expect(() => assertOwner('user1', participation)).not.toThrow();
        });

        it('should throw ForbiddenException when userId does not match', () => {
            const participation = { userId: 'user1' } as any;

            expect(() => assertOwner('user2', participation)).toThrow(
                ForbiddenException,
            );
        });
    });

    describe('assertCanCreateOrRejoin', () => {
        it('should not throw when participation is null', () => {
            expect(() => assertCanCreateOrRejoin(null)).not.toThrow();
        });

        it('should not throw when status is CANCELLED', () => {
            const participation = { status: 'CANCELLED' } as any;

            expect(() => assertCanCreateOrRejoin(participation)).not.toThrow();
        });

        it('should throw ConflictException when already registered', () => {
            const participation = { status: 'PENDING' } as any;

            expect(() => assertCanCreateOrRejoin(participation)).toThrow(
                ConflictException,
            );
        });
    });
});
