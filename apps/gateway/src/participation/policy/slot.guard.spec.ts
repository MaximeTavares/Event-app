import { assertCanJoin, syncSlotStatus } from './slot.guards';
import { BadRequestException } from '@nestjs/common';

describe('slot.guards', () => {
    describe('assertCanJoin', () => {
        it('should not throw when slot is OPEN and has room', () => {
            const slot = { status: 'OPEN', max_participant: 10 } as any;

            expect(() => assertCanJoin(slot, 5)).not.toThrow();
        });

        it('should throw BadRequestException when slot is FULL', () => {
            const slot = { status: 'FULL', max_participant: 10 } as any;

            expect(() => assertCanJoin(slot, 10)).toThrow(BadRequestException);
        });

        it('should throw BadRequestException when slot is at max capacity even if OPEN', () => {
            const slot = { status: 'OPEN', max_participant: 10 } as any;

            expect(() => assertCanJoin(slot, 10)).toThrow('Slot is full');
        });

        it('should throw BadRequestException when slot is CLOSED', () => {
            const slot = { status: 'CLOSED', max_participant: 10 } as any;

            expect(() => assertCanJoin(slot, 0)).toThrow('Slot is closed');
        });
    });

    describe('syncSlotStatus', () => {
        it('should update slot to FULL when accepted count reaches max', async () => {
            const tx = {
                slot: {
                    findUnique: jest.fn().mockResolvedValue({
                        id: 1,
                        status: 'OPEN',
                        max_participant: 5,
                    }),
                    update: jest.fn().mockResolvedValue({}),
                },
                participation: {
                    count: jest.fn().mockResolvedValue(5),
                },
            } as any;

            await syncSlotStatus(tx, 1);

            expect(tx.slot.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { status: 'FULL' },
            });
        });

        it('should not update when status is already correct', async () => {
            const tx = {
                slot: {
                    findUnique: jest.fn().mockResolvedValue({
                        id: 1,
                        status: 'OPEN',
                        max_participant: 5,
                    }),
                    update: jest.fn(),
                },
                participation: {
                    count: jest.fn().mockResolvedValue(2),
                },
            } as any;

            await syncSlotStatus(tx, 1);

            expect(tx.slot.update).not.toHaveBeenCalled();
        });

        it('should return early when slot does not exist', async () => {
            const tx = {
                slot: {
                    findUnique: jest.fn().mockResolvedValue(null),
                    update: jest.fn(),
                },
                participation: {
                    count: jest.fn(),
                },
            } as any;

            await syncSlotStatus(tx, 999);

            expect(tx.participation.count).not.toHaveBeenCalled();
            expect(tx.slot.update).not.toHaveBeenCalled();
        });
    });
});
