/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshToken } from './refresh-token.schema';
import { compare, hash } from 'src/utils/password.util';

jest.mock('../utils/password.util');

describe('RefreshTokenService', () => {
    let service: RefreshTokenService;
    let refreshTokenModel: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RefreshTokenService,
                {
                    provide: getModelToken(RefreshToken.name),
                    useValue: {
                        deleteMany: jest.fn(),
                        create: jest.fn(),
                        findOne: jest.fn(),
                        updateMany: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<RefreshTokenService>(RefreshTokenService);
        refreshTokenModel = module.get(getModelToken(RefreshToken.name));
    });

    describe('save', () => {
        it('should delete old tokens and create a new one', async () => {
            (hash as jest.Mock).mockResolvedValue('hashedToken123');
            refreshTokenModel.deleteMany.mockResolvedValue({});
            refreshTokenModel.create.mockResolvedValue({
                userId: 'user1',
                tokenHash: 'hashedToken123',
            });

            await service.save('user1', 'rawRefreshToken');

            expect(refreshTokenModel.deleteMany).toHaveBeenCalledWith({
                userId: 'user1',
            });
            expect(refreshTokenModel.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    userId: 'user1',
                    tokenHash: 'hashedToken123',
                    revoked: false,
                }),
            );
        });
    });

    describe('validate', () => {
        it('should return true when token matches', async () => {
            refreshTokenModel.findOne.mockResolvedValue({
                userId: 'user1',
                tokenHash: 'hashedToken123',
            });
            (compare as jest.Mock).mockResolvedValue(true);

            const result = await service.validate('user1', 'rawToken');

            expect(result).toBe(true);
        });

        it('should return false when no token found in db', async () => {
            refreshTokenModel.findOne.mockResolvedValue(null);

            const result = await service.validate('user1', 'rawToken');

            expect(result).toBe(false);
        });

        it('should return false when token does not match', async () => {
            refreshTokenModel.findOne.mockResolvedValue({
                userId: 'user1',
                tokenHash: 'hashedToken123',
            });
            (compare as jest.Mock).mockResolvedValue(false);

            const result = await service.validate('user1', 'wrongToken');

            expect(result).toBe(false);
        });
    });

    describe('revoke', () => {
        it('should call updateMany with correct filter', async () => {
            refreshTokenModel.updateMany.mockResolvedValue({});

            await service.revoke('user1');

            expect(refreshTokenModel.updateMany).toHaveBeenCalledWith(
                { userId: 'user1', revoked: false },
                { revoked: true },
            );
        });
    });

    describe('rotate', () => {
        it('should save new token when old token is valid', async () => {
            refreshTokenModel.findOne.mockResolvedValue({
                userId: 'user1',
                tokenHash: 'oldHashedToken',
            });
            (compare as jest.Mock).mockResolvedValue(true);
            (hash as jest.Mock).mockResolvedValue('newHashedToken');
            refreshTokenModel.deleteMany.mockResolvedValue({});
            refreshTokenModel.create.mockResolvedValue({});

            await service.rotate('user1', 'oldToken', 'newToken');

            expect(refreshTokenModel.create).toHaveBeenCalledWith(
                expect.objectContaining({ tokenHash: 'newHashedToken' }),
            );
        });

        it('should throw when old token is invalid', async () => {
            refreshTokenModel.findOne.mockResolvedValue(null);

            await expect(
                service.rotate('user1', 'oldToken', 'newToken'),
            ).rejects.toThrow();

            expect(refreshTokenModel.create).not.toHaveBeenCalled();
        });
    });
});
