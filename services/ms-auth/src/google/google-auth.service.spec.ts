import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { GoogleAuthService } from './google-auth.service';

jest.mock('google-auth-library');

describe('GoogleAuthService', () => {
    let service: GoogleAuthService;
    let mockGetToken: jest.Mock;
    let mockVerifyIdToken: jest.Mock;

    beforeEach(async () => {
        mockGetToken = jest.fn();
        mockVerifyIdToken = jest.fn();

        (OAuth2Client as unknown as jest.Mock).mockImplementation(() => ({
            getToken: mockGetToken,
            verifyIdToken: mockVerifyIdToken,
        }));

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GoogleAuthService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockReturnValue('fake-value'),
                    },
                },
            ],
        }).compile();

        service = module.get<GoogleAuthService>(GoogleAuthService);
    });

    describe('exchangeCodeForIdToken', () => {
        it('should return the id_token', async () => {
            mockGetToken.mockResolvedValue({
                tokens: { id_token: 'idToken123' },
            });

            const result = await service.exchangeCodeForIdToken('authCode');

            expect(mockGetToken).toHaveBeenCalledWith({
                code: 'authCode',
                redirect_uri: 'postmessage',
            });
            expect(result).toBe('idToken123');
        });

        it('should throw when no id_token is returned', async () => {
            mockGetToken.mockResolvedValue({ tokens: {} });

            await expect(
                service.exchangeCodeForIdToken('authCode'),
            ).rejects.toThrow('No id_token returned by Google');
        });
    });

    describe('verifyToken', () => {
        it('should return the payload when token is valid', async () => {
            mockVerifyIdToken.mockResolvedValue({
                getPayload: () => ({
                    email: 'test@example.com',
                    sub: 'googleSub123',
                }),
            });

            const result = await service.verifyToken('idToken123');

            expect(mockVerifyIdToken).toHaveBeenCalledWith({
                idToken: 'idToken123',
                audience: 'fake-value',
            });
            expect(result).toEqual({
                email: 'test@example.com',
                sub: 'googleSub123',
            });
        });

        it('should throw when payload is empty', async () => {
            mockVerifyIdToken.mockResolvedValue({
                getPayload: () => null,
            });

            await expect(service.verifyToken('idToken123')).rejects.toThrow(
                'Invalid Google token',
            );
        });
    });
});
