import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { from, map, Observable } from 'rxjs';
import { Server } from 'ws';
import { Injectable } from '@nestjs/common';

@WebSocketGateway(5000)
export class ChatBackEndGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    client: Record<string, any>;
    constructor() {
        this.client = {};
    }
    @WebSocketServer()
    server: Server;

    public handleConnection(client): void {
        client['id'] = String(Number(new Date()));
        client['nickname'] = '낯선남자' + String(Number(new Date()));
        this.client[client['id']] = client;
    }

    public handleDisconnect(client): void {
        delete this.client[client['id']];
    }

    @SubscribeMessage('message')
    handleMessage(client: any, payload: any): void {
        for (const [key, value] of Object.entries(this.client)) {
            value.send(
                JSON.stringify({
                    event: 'events',
                    data: { nickname: client['nickname'], message: payload },
                }),
            );
        }
    }

    @SubscribeMessage('nickname')
    setNickname(client: any, payload: any): void {
        this.client[client['id']]['nickname'] = payload;
    }
    // handleMessage(client: any, payload: any): Observable<WsResponse<string>> {
    //     return from(['1', '2', '3']).pipe(
    //         map((item) => ({ event: 'events', data: item })),
    //     );
    // }
}
