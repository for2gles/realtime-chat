import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { from, map, Observable } from 'rxjs';
// import { Server } from 'ws';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@WebSocketGateway(5000, {
    cors: {
        origin: 'http://localhost:3000',
    },
})
export class ChatBackEndGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    client: Record<string, Socket>;
    constructor() {
        this.client = {};
    }
    @WebSocketServer()
    server: Server;

    //소켓 연결시 오브젝트에 저장
    public handleConnection(client: Socket): void {
        console.log('connected', client.id);
        this.client[client.id] = client;
    }

    //소켓 연결 해제시 오브젝트에서 제거
    public handleDisconnect(client: Socket): void {
        console.log('disonnected', client.id);
        delete this.client[client.id];
    }

    //메시지가 전송되면 모든 유저에게 메시지 전송
    @SubscribeMessage('sendMessage')
    sendMessage(client: Socket, message: string): void {
        for (const [id, thisClient] of Object.entries(this.client)) {
            thisClient.emit('getMessage', {
                id: client.id,
                nickname: thisClient.data.nickname,
                message,
            });
        }
    }

    //처음 접속시 닉네임 등 최초 설정
    @SubscribeMessage('setInit')
    setInit(client: Socket, payload: any) {
        if (client.data.isInit) {
            return;
        }
        client.data.nickname = payload.nickname
            ? payload.nickname
            : '낯선사람' + client.id;
        client.data.isInit = true;
        return {
            nickname: client.data.nickname,
        };
    }

    //닉네임 변경
    @SubscribeMessage('setNickname')
    setNickname(client: Socket, payload: string): void {
        client.data.nickname = payload;
    }
}
