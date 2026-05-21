import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NatsService {
    constructor(@Inject('nats') private readonly nats: ClientProxy) {}
    // Fonctions pour communiquer avec le message broker

    // Fonction qui envoi à nats
    emit(subject: string, data: Record<string, unknown>): void {
        this.nats.emit(subject, data);
    }

    async send(subject: string, data: unknown) {
        return firstValueFrom(this.nats.send(subject, data));
    }
}
