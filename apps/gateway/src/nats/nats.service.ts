import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NatsService {
    constructor(@Inject('nats') private readonly nats: ClientProxy) {}

    emit<TPayload>(subject: string, data: TPayload): void {
        this.nats.emit(subject, data);
    }

    async send<TResponse, TPayload = unknown>(
        subject: string,
        data: TPayload,
    ): Promise<TResponse> {
        return firstValueFrom(
            this.nats.send<TResponse, TPayload>(subject, data),
        );
    }
}
