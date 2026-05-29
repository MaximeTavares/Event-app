import { Injectable } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        const url = process.env.DATABASE_URL;

        if (!url) {
            throw new Error('DATABASE_URL missing');
        }

        const adapter = new PrismaMariaDb(url);

        super({ adapter });
    }
}
