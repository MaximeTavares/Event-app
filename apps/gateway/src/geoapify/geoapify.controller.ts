import { Controller, Get, Query } from '@nestjs/common';
import { GeoapifyService } from './geoapify.service';
import { GeocodeDto } from './dto/geocode.dto';
import { Coordinates } from './type/geoapify.type';

@Controller('geoapify')
export class GeoapifyController {
    constructor(private readonly service: GeoapifyService) {}

    @Get('geocode')
    async geocode(@Query() dto: GeocodeDto): Promise<Coordinates | null> {
        return this.service.geocodeAddress(dto);
    }
}
