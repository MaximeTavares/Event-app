import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client, TokenPayload } from 'google-auth-library';

@Injectable()
export class GoogleAuthService {
    private readonly client: OAuth2Client;

    constructor(private readonly configService: ConfigService) {
        this.client = new OAuth2Client(
            this.configService.get('GOOGLE_CLIENT_ID'),
            this.configService.get('GOOGLE_CLIENT_SECRET'),
        );
    }

    async exchangeCodeForIdToken(code: string): Promise<string> {
        const { tokens } = await this.client.getToken({
            code,
            redirect_uri: 'postmessage',
        });

        if (!tokens.id_token) {
            throw new Error('No id_token returned by Google');
        }

        return tokens.id_token;
    }

    async verifyToken(idToken: string): Promise<TokenPayload> {
        const token = await this.client.verifyIdToken({
            idToken,
            audience: this.configService.get('GOOGLE_CLIENT_ID'),
        });

        const payload = token.getPayload();

        if (!payload) throw new UnauthorizedException('Invalid Google token');

        return payload;
    }
}
