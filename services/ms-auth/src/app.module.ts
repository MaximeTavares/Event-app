import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthModule } from './health.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        // MongooseModule.forRoot('mongodb://localhost:27017/mongo-auth'),
        MongooseModule.forRoot(`${process.env.MONGO_URL}`),

        AuthModule,
        HealthModule,
    ],
})
export class AppModule {}
