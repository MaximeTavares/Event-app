import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Address {
    @Prop() street_number?: string;
    @Prop() street_name?: string;
    @Prop() address_line_2?: string;
    @Prop() city?: string;
    @Prop() postal_code?: string;
    @Prop() country?: string;
}
