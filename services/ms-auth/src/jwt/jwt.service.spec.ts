/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { JwtTokenService } from './jwt.service';

describe('JwtTokenService', () => {
    let service: JwtTokenService;
    let jwtService: jest.Mocked<JwtService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JwtTokenService,
                {
                    provide: JwtService,
                    useValue: {
                        signAsync: jest.fn(),
                        verifyAsync: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<JwtTokenService>(JwtTokenService);
        jwtService = module.get(JwtService);
    });

    describe('generateAccessToken', () => {
        it('should call signAsync with correct payload and options', async () => {
            jwtService.signAsync.mockResolvedValue('accessToken123');

            const result = await service.generateAccessToken({
                id: 'user1',
                email: 'test@example.com',
                role: 'USER',
            });

            expect(jwtService.signAsync).toHaveBeenCalledWith(
                { sub: 'user1', email: 'test@example.com', role: 'USER' },
                expect.objectContaining({
                    secret: process.env.JWT_ACCESS_SECRET,
                    algorithm: expect.any(String),
                }),
            );
            expect(result).toBe('accessToken123');
        });
    });

    describe('generateRefreshToken', () => {
        it('should call signAsync with correct payload', async () => {
            jwtService.signAsync.mockResolvedValue('refreshToken123');

            const result = await service.generateRefreshToken({ id: 'user1' });

            expect(jwtService.signAsync).toHaveBeenCalledWith(
                { sub: 'user1' },
                expect.objectContaining({
                    secret: process.env.JWT_REFRESH_SECRET,
                }),
            );
            expect(result).toBe('refreshToken123');
        });
    });

    describe('verifyToken', () => {
        it('should return the decoded payload', async () => {
            jwtService.verifyAsync.mockResolvedValue({
                sub: 'user1',
                email: 'test@example.com',
                role: 'USER',
            });

            const result = await service.verifyToken('someToken');

            expect(jwtService.verifyAsync).toHaveBeenCalledWith('someToken', {
                secret: process.env.JWT_REFRESH_SECRET,
            });
            expect(result).toEqual({
                sub: 'user1',
                email: 'test@example.com',
                role: 'USER',
            });
        });

        it('should throw when token is invalid', async () => {
            jwtService.verifyAsync.mockRejectedValue(
                new Error('invalid token'),
            );

            await expect(service.verifyToken('badToken')).rejects.toThrow();
        });
    });

    describe('insertIntoCookies', () => {
        it('should call response.cookie with correct arguments', () => {
            const mockResponse = {
                cookie: jest.fn(),
            } as any;

            service.insertIntoCookies(
                'token123',
                'refreshToken',
                mockResponse,
                {
                    maxAge: 100000,
                },
            );

            expect(mockResponse.cookie).toHaveBeenCalledWith(
                'refreshToken',
                'token123',
                expect.objectContaining({
                    secure: false,
                    httpOnly: true,
                    sameSite: 'strict',
                    path: '/ms/auth/refresh_token',
                    maxAge: 100000,
                }),
            );
        });
    });
});
