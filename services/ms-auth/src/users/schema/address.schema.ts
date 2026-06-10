import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Address {
    @Prop() streetNumber?: string;
    @Prop() streetName?: string;
    @Prop() addressLine2?: string;
    @Prop() city?: string;
    @Prop() postalCode?: string;
    @Prop() country?: string;
}
