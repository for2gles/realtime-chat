import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class ClientListService {
    private clientList: Record<string, Socket>;
    constructor() {
        this.clientList = {};
    }

    addClient(id: string, client: Socket): void {
        this.clientList[id] = client;
    }

    deleteClient(id: string): void {
        delete this.clientList[id];
    }

    getClient(id: string): Socket {
        return this.clientList[id];
    }

    getClientList(): Record<string, Socket> {
        return this.clientList;
    }
}
