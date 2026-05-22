import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot('mongodb://localhost:27017/mongo-auth'),
        AuthModule,
    ],
})
export class AppModule {}
