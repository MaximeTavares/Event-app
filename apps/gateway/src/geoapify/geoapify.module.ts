import { Module } from '@nestjs/common';
import { GeoapifyService } from './geoapify.service';
import { GeoapifyController } from './geoapify.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    providers: [GeoapifyService],
    controllers: [GeoapifyController],
    exports: [GeoapifyService],
})
export class GeoapifyModule {}
