/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { User } from './schema/user.schema';

describe('UserService', () => {
    let service: UserService;
    let userModel: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getModelToken(User.name),
                    useValue: {
                        findOne: jest.fn(),
                        findById: jest.fn(),
                        find: jest.fn(),
                        create: jest.fn(),
                        findByIdAndUpdate: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        userModel = module.get(getModelToken(User.name));
    });

    describe('findByEmail', () => {
        it('should return a user when found', async () => {
            userModel.findOne.mockResolvedValue({
                id: '1',
                email: 'test@example.com',
            });

            const result = await service.findByEmail('test@example.com');

            expect(userModel.findOne).toHaveBeenCalledWith({
                email: 'test@example.com',
            });
            expect(result).toEqual({ id: '1', email: 'test@example.com' });
        });

        it('should return null when user is not found', async () => {
            userModel.findOne.mockResolvedValue(null);

            const result = await service.findByEmail('unknown@example.com');

            expect(result).toBeNull();
        });
    });

    describe('findById', () => {
        it('should return a user when found', async () => {
            userModel.findById.mockResolvedValue({
                id: '1',
                email: 'test@example.com',
            });

            const result = await service.findById('1');

            expect(userModel.findById).toHaveBeenCalledWith('1');
            expect(result).toEqual({ id: '1', email: 'test@example.com' });
        });

        it('should throw an RpcException when user is not found', async () => {
            userModel.findById.mockResolvedValue(null);

            await expect(service.findById('unknown')).rejects.toThrow();
        });
    });

    describe('create', () => {
        it('should call userModel.create with the given data', async () => {
            const newUser = {
                email: 'new@example.com',
                password: 'hashedPassword',
            };
            userModel.create.mockResolvedValue({
                id: '1',
                ...newUser,
            });

            const result = await service.create(newUser);

            expect(userModel.create).toHaveBeenCalledWith(newUser);
            expect(result).toEqual({ id: '1', ...newUser });
        });
    });

    describe('findOrCreateGoogleUser', () => {
        it('should return the existing user when found', async () => {
            userModel.findOne.mockResolvedValue({
                id: '1',
                email: 'test@example.com',
            });

            const result = await service.findOrCreateGoogleUser({
                email: 'test@example.com',
                googleSub: 'googleSub123',
            });

            expect(userModel.findOne).toHaveBeenCalledWith({
                email: 'test@example.com',
            });
            expect(userModel.create).not.toHaveBeenCalled();
            expect(result).toEqual({ id: '1', email: 'test@example.com' });
        });

        it('should create a new user when not found', async () => {
            userModel.findOne.mockResolvedValue(null);
            userModel.create.mockResolvedValue({
                id: '2',
                email: 'new@example.com',
            });

            const result = await service.findOrCreateGoogleUser({
                email: 'new@example.com',
                googleSub: 'googleSub456',
                firstName: 'Max',
                lastName: 'Dev',
                avatarUrl: 'http://avatar.url',
            });

            expect(userModel.create).toHaveBeenCalledWith({
                email: 'new@example.com',
                providers: {
                    google: { sub: 'googleSub456' },
                },
                profile: {
                    firstName: 'Max',
                    lastName: 'Dev',
                    avatarUrl: 'http://avatar.url',
                },
            });
            expect(result).toEqual({ id: '2', email: 'new@example.com' });
        });
    });

    describe('findManyByIds', () => {
        it('should return mapped users', async () => {
            userModel.find.mockReturnValue({
                lean: jest.fn().mockReturnValue({
                    exec: jest.fn().mockResolvedValue([
                        {
                            _id: { toString: () => '1' },
                            email: 'test@example.com',
                            profile: {
                                firstName: 'Max',
                                lastName: 'Dev',
                                avatarUrl: 'http://avatar.url',
                            },
                        },
                    ]),
                }),
            });

            const result = await service.findManyByIds(['1']);

            expect(userModel.find).toHaveBeenCalledWith({
                _id: { $in: ['1'] },
            });
            expect(result).toEqual([
                {
                    id: '1',
                    email: 'test@example.com',
                    first_name: 'Max',
                    last_name: 'Dev',
                    avatar_url: 'http://avatar.url',
                },
            ]);
        });
    });

    describe('findAll', () => {
        it('should return all users', async () => {
            userModel.find.mockResolvedValue([{ id: '1' }, { id: '2' }]);

            const result = await service.findAll();

            expect(result).toEqual([{ id: '1' }, { id: '2' }]);
        });
    });

    describe('findSettingsSection', () => {
        it('should return the requested section', async () => {
            userModel.findById.mockResolvedValue({
                id: '1',
                preferences: { fontSize: 'md', theme: 'dark' },
            });

            const result = await service.findSettingsSection(
                '1',
                'preferences',
            );

            expect(result).toEqual({ fontSize: 'md', theme: 'dark' });
        });

        it('should throw when user is not found', async () => {
            userModel.findById.mockResolvedValue(null);

            await expect(
                service.findSettingsSection('unknown', 'preferences'),
            ).rejects.toThrow();
        });
    });

    describe('updateSettingsSection', () => {
        it('should update and return the section', async () => {
            userModel.findByIdAndUpdate.mockResolvedValue({
                id: '1',
                preferences: { fontSize: 'lg', theme: 'light' },
            });

            const result = await service.updateSettingsSection(
                '1',
                'preferences',
                {
                    fontSize: 'lg',
                    theme: 'light',
                } as any,
            );

            expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
                '1',
                { $set: { preferences: { fontSize: 'lg', theme: 'light' } } },
                { returnDocument: 'after', runValidators: true },
            );
            expect(result).toEqual({ fontSize: 'lg', theme: 'light' });
        });

        it('should throw when update fails (user not found)', async () => {
            userModel.findByIdAndUpdate.mockResolvedValue(null);

            await expect(
                service.updateSettingsSection(
                    'unknown',
                    'preferences',
                    {} as any,
                ),
            ).rejects.toThrow();
        });
    });

    describe('updateById', () => {
        it('should call findByIdAndUpdate with the correct arguments', async () => {
            userModel.findByIdAndUpdate.mockResolvedValue({
                id: '1',
                email: 'updated@example.com',
            });

            const result = await service.updateById('1', {
                email: 'updated@example.com',
            });

            expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
                '1',
                { $set: { email: 'updated@example.com' } },
                { returnDocument: 'after', runValidators: true },
            );
            expect(result).toEqual({ id: '1', email: 'updated@example.com' });
        });
    });

    describe('findProfileById', () => {
        it('should return the mapped profile', async () => {
            userModel.findById.mockResolvedValue({
                id: '1',
                profile: {
                    firstName: 'Max',
                    lastName: 'Dev',
                    avatarUrl: 'http://avatar.url',
                },
            });

            const result = await service.findProfileById('1');

            expect(result).toBeDefined();
        });

        it('should throw when user is not found', async () => {
            userModel.findById.mockResolvedValue(null);

            await expect(service.findProfileById('unknown')).rejects.toThrow();
        });
    });

    describe('findProfileById', () => {
        it('should return the mapped profile', async () => {
            userModel.findById.mockResolvedValue({
                id: '1',
                profile: {
                    firstName: 'Max',
                    lastName: 'Dev',
                    avatarUrl: 'http://avatar.url',
                },
            });

            const result = await service.findProfileById('1');

            expect(result).toEqual({
                firstName: 'Max',
                lastName: 'Dev',
                bio: undefined,
                phone: undefined,
                avatarUrl: 'http://avatar.url',
                address: undefined,
            });
        });

        it('should throw when user is not found', async () => {
            userModel.findById.mockResolvedValue(null);

            await expect(service.findProfileById('unknown')).rejects.toThrow();
        });
    });

    describe('updateProfile', () => {
        it('should update and return the mapped profile', async () => {
            userModel.findByIdAndUpdate.mockResolvedValue({
                id: '1',
                profile: {
                    firstName: 'Max',
                    lastName: 'Dev',
                    avatarUrl: 'http://avatar.url',
                },
            });

            const result = await service.updateProfile('1', {
                firstName: 'Max',
                lastName: 'Dev',
                avatarUrl: 'http://avatar.url',
            });

            expect(result).toEqual({
                firstName: 'Max',
                lastName: 'Dev',
                bio: undefined,
                phone: undefined,
                avatarUrl: 'http://avatar.url',
                address: undefined,
            });
        });

        it('should throw when data is falsy', async () => {
            await expect(
                service.updateProfile('1', null as any),
            ).rejects.toThrow();
        });

        it('should throw when update fails', async () => {
            userModel.findByIdAndUpdate.mockResolvedValue(null);

            await expect(
                service.updateProfile('1', { firstName: 'Max' } as any),
            ).rejects.toThrow();
        });
    });
});
