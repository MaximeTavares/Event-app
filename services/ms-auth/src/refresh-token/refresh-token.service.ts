import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RefreshToken } from './refresh-token.schema';
import { Model } from 'mongoose';
import { compare, hash } from 'src/utils/password.util';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class RefreshTokenService {
    constructor(
        @InjectModel(RefreshToken.name)
        private readonly refreshTokenModel: Model<RefreshToken>,
    ) {}

    async save(userId: string, refreshToken: string) {
        const hashed = await hash(refreshToken);

        await this.refreshTokenModel.deleteMany({ userId });

        return this.refreshTokenModel.create({
            userId,
            tokenHash: hashed,
            revoked: false,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
    }

    async validate(userId: string, token: string): Promise<boolean> {
        const tokenInDb = await this.refreshTokenModel.findOne({
            userId,
            revoked: false,
        });

        if (!tokenInDb) return false;

        return compare(token, tokenInDb.tokenHash);
    }

    async revoke(userId: string) {
        await this.refreshTokenModel.updateMany(
            { userId, revoked: false },
            { revoked: true },
        );
    }

    async rotate(userId: string, oldToken: string, newToken: string) {
        const isValid = await this.validate(userId, oldToken);

        if (!isValid) {
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid Refresh Token',
            });
        }

        await this.save(userId, newToken);
    }
}
