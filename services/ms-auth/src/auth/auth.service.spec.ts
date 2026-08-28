import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from 'src/users/user.service';
import { JwtTokenService } from '../jwt/jwt.service';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import { GoogleAuthService } from 'src/google/google-auth.service';
import { compare, hash } from '../utils/password.util';

jest.mock('../utils/password.util');
jest.mock('../users/user.service');

describe('AuthService', () => {
    let service: AuthService;
    let userService: jest.Mocked<UserService>;
    let jwtTokenService: jest.Mocked<JwtTokenService>;
    let refreshTokenService: jest.Mocked<RefreshTokenService>;
    let googleAuthService: jest.Mocked<GoogleAuthService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useValue: {
                        findByEmail: jest.fn(),
                        create: jest.fn(),
                        findById: jest.fn(),
                        updateById: jest.fn(),
                        findOrCreateGoogleUser: jest.fn(),
                    },
                },
                {
                    provide: JwtTokenService,
                    useValue: {
                        generateAccessToken: jest.fn(),
                        generateRefreshToken: jest.fn(),
                        verifyToken: jest.fn(),
                    },
                },
                {
                    provide: RefreshTokenService,
                    useValue: {
                        save: jest.fn(),
                        validate: jest.fn(),
                        rotate: jest.fn(),
                        revoke: jest.fn(),
                    },
                },
                {
                    provide: GoogleAuthService,
                    useValue: {
                        exchangeCodeForIdToken: jest.fn(),
                        verifyToken: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        userService = module.get(UserService);
        jwtTokenService = module.get(JwtTokenService);
        refreshTokenService = module.get(RefreshTokenService);
        googleAuthService = module.get(GoogleAuthService);
    });

    describe('signup', () => {
        it('should create a new user when email does not exist', async () => {
            userService.findByEmail.mockResolvedValue(null);
            userService.create.mockResolvedValue({} as any);
            (hash as jest.Mock).mockResolvedValue('hashedPassword123');

            const result = await service.signup({
                email: 'test@example.com',
                password: 'password123',
                firstName: 'Max',
                lastName: 'Dev',
            });

            expect(userService.findByEmail).toHaveBeenCalledWith(
                'test@example.com',
            );
            expect(hash).toHaveBeenCalledWith('password123');
            expect(userService.create).toHaveBeenCalledWith(
                expect.objectContaining({ email: 'test@example.com' }),
            );
            expect(result).toEqual({ success: true });
        });

        it('should throw an RpcException when email already exists', async () => {
            userService.findByEmail.mockResolvedValue({
                id: '1',
                email: 'test@example.com',
            } as any);

            await expect(
                service.signup({
                    email: 'test@example.com',
                    password: 'password123',
                    firstName: 'Max',
                    lastName: 'Dev',
                }),
            ).rejects.toThrow();

            expect(userService.create).not.toHaveBeenCalled();
        });
    });

    describe('signin', () => {
        it('should return tokens when credentials are valid', async () => {
            userService.findByEmail.mockResolvedValue({
                id: '1',
                email: 'test@example.com',
                password: 'hashedPassword123',
            } as any);
            (compare as jest.Mock).mockResolvedValue(true);
            jwtTokenService.generateAccessToken.mockResolvedValue(
                'accessToken123',
            );
            jwtTokenService.generateRefreshToken.mockResolvedValue(
                'refreshToken123',
            );
            refreshTokenService.save.mockResolvedValue({} as any);

            const result = await service.signin({
                email: 'test@example.com',
                password: 'password123',
            });

            expect(result).toEqual({
                accessToken: 'accessToken123',
                refreshToken: 'refreshToken123',
            });
        });

        it('should throw when user does not exist', async () => {
            userService.findByEmail.mockResolvedValue(null);

            await expect(
                service.signin({ email: 'nope@example.com', password: 'x' }),
            ).rejects.toThrow();
        });

        it('should throw when password is incorrect', async () => {
            userService.findByEmail.mockResolvedValue({
                id: '1',
                email: 'test@example.com',
                password: 'hashedPassword123',
            } as any);
            (compare as jest.Mock).mockResolvedValue(false);

            await expect(
                service.signin({
                    email: 'test@example.com',
                    password: 'wrong',
                }),
            ).rejects.toThrow();
        });
    });

    describe('refresh', () => {
        it('should return new tokens when refresh token is valid', async () => {
            jwtTokenService.verifyToken.mockResolvedValue({
                sub: 'user1',
                email: 'test@example.com',
                role: 'USER',
            } as any);
            userService.findById.mockResolvedValue({
                id: 'user1',
                email: 'test@example.com',
                role: 'USER',
            } as any);
            refreshTokenService.validate.mockResolvedValue(true);
            jwtTokenService.generateAccessToken.mockResolvedValue(
                'newAccessToken',
            );
            jwtTokenService.generateRefreshToken.mockResolvedValue(
                'newRefreshToken',
            );
            refreshTokenService.rotate.mockResolvedValue({} as any);

            const result = await service.refresh('oldRefreshToken');

            expect(result).toEqual({
                accessToken: 'newAccessToken',
                refreshToken: 'newRefreshToken',
            });
        });

        it('should throw when token verification fails', async () => {
            jwtTokenService.verifyToken.mockRejectedValue(new Error('invalid'));

            await expect(service.refresh('badToken')).rejects.toThrow();
        });

        it('should throw when user no longer exists', async () => {
            jwtTokenService.verifyToken.mockResolvedValue({
                sub: 'user1',
                email: 'test@example.com',
                role: 'USER',
            } as any);
            userService.findById.mockResolvedValue(null);

            await expect(service.refresh('someToken')).rejects.toThrow();
        });

        it('should throw when refresh token is revoked', async () => {
            jwtTokenService.verifyToken.mockResolvedValue({
                sub: 'user1',
                email: 'test@example.com',
                role: 'USER',
            } as any);
            userService.findById.mockResolvedValue({ id: 'user1' } as any);
            refreshTokenService.validate.mockResolvedValue(false);

            await expect(service.refresh('revokedToken')).rejects.toThrow();
        });
    });

    describe('changePassword', () => {
        it('should update password when current password is valid', async () => {
            userService.findById.mockResolvedValue({
                id: 'user1',
                password: 'oldHashedPassword',
            } as any);
            (compare as jest.Mock).mockResolvedValue(true);
            (hash as jest.Mock).mockResolvedValue('newHashedPassword');
            userService.updateById.mockResolvedValue({} as any);

            await service.changePassword('user1', {
                currentPassword: 'oldPassword',
                newPassword: 'newPassword',
                confirmPassword: 'newPassword',
            });

            expect(userService.updateById).toHaveBeenCalledWith('user1', {
                password: 'newHashedPassword',
            });
        });

        it('should throw when user does not exist', async () => {
            userService.findById.mockResolvedValue(null);

            await expect(
                service.changePassword('unknown', {
                    currentPassword: 'x',
                    newPassword: 'y',
                    confirmPassword: 'y',
                }),
            ).rejects.toThrow();
        });

        it('should throw when current password is incorrect', async () => {
            userService.findById.mockResolvedValue({
                id: 'user1',
                password: 'oldHashedPassword',
            } as any);
            (compare as jest.Mock).mockResolvedValue(false);

            await expect(
                service.changePassword('user1', {
                    currentPassword: 'wrong',
                    newPassword: 'newPassword',
                    confirmPassword: 'newPassword',
                }),
            ).rejects.toThrow();
        });
    });

    describe('signout', () => {
        it('should call revoke with the user id', async () => {
            refreshTokenService.revoke.mockResolvedValue({} as any);

            await service.signout('user1');

            expect(refreshTokenService.revoke).toHaveBeenCalledWith('user1');
        });
    });

    describe('googleSignin', () => {
        it('should return tokens for a valid google code', async () => {
            googleAuthService.exchangeCodeForIdToken.mockResolvedValue(
                'idToken123',
            );
            googleAuthService.verifyToken.mockResolvedValue({
                email: 'test@example.com',
                sub: 'googleSub123',
                given_name: 'Max',
                family_name: 'Dev',
                picture: 'http://avatar.url',
            } as any);
            userService.findOrCreateGoogleUser.mockResolvedValue({
                id: 'user1',
                email: 'test@example.com',
                role: 'USER',
            } as any);
            jwtTokenService.generateAccessToken.mockResolvedValue(
                'accessToken123',
            );
            jwtTokenService.generateRefreshToken.mockResolvedValue(
                'refreshToken123',
            );
            refreshTokenService.save.mockResolvedValue({} as any);

            const result = await service.googleSignin('googleAuthCode');

            expect(
                googleAuthService.exchangeCodeForIdToken,
            ).toHaveBeenCalledWith('googleAuthCode');
            expect(userService.findOrCreateGoogleUser).toHaveBeenCalledWith(
                expect.objectContaining({
                    email: 'test@example.com',
                    googleSub: 'googleSub123',
                }),
            );
            expect(result).toEqual({
                accessToken: 'accessToken123',
                refreshToken: 'refreshToken123',
            });
        });
    });
});
