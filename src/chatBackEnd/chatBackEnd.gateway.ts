import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ClientListService } from './clientList.service';
import { ChatRoomService } from './chatRoom.service';
import { setInitDTO, chatRoomListDTO } from './dto/chatBackEnd.dto';
import { Observable, map, from } from 'rxjs';

@WebSocketGateway(5000, {
    cors: {
        origin: 'http://localhost:3000',
    },
})
export class ChatBackEndGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    constructor(
        private readonly ClientListService: ClientListService,
        private readonly ChatRoomService: ChatRoomService,
    ) {}
    @WebSocketServer()
    server: Server;

    //소켓 연결시 유저목록에 추가
    public handleConnection(client: Socket): void {
        console.log('connected', client.id);
        client.leave(client.id);
        client.join('room:lobby');
        this.ClientListService.addClient(client.id, client);
    }

    //소켓 연결 해제시 유저목록에서 제거
    public handleDisconnect(client: Socket): void {
        console.log('disonnected', client.id);
        this.ClientListService.deleteClient(client.id);
    }

    //메시지가 전송되면 모든 유저에게 메시지 전송
    @SubscribeMessage('sendMessage')
    sendMessage(client: Socket, message: string): void {
        // console.log(client.);
        client.rooms.forEach((room_id) =>
            client.to(room_id).emit('getMessage', {
                id: client.id,
                nickname: client.data.nickname,
                message,
            }),
        );
        // const chatRoom = this.ChatRoomService.getChatRoom(client.data.room_id);
        // for (const thisClientId of chatRoom.in_room) {
        //     this.ClientListService.getClient(thisClientId).emit('getMessage', {
        //         id: client.id,
        //         nickname: client.data.nickname,
        //         message,
        //     });
        // }
    }

    //처음 접속시 닉네임 등 최초 설정
    @SubscribeMessage('setInit')
    setInit(client: Socket, data: setInitDTO): setInitDTO {
        // 이미 최초 세팅이 되어있는 경우 패스
        if (client.data.isInit) {
            return;
        }

        client.data.nickname = data.nickname
            ? data.nickname
            : '낯선사람' + client.id;

        client.data.isInit = true;

        return {
            nickname: client.data.nickname,
        };
    }

    //닉네임 변경
    @SubscribeMessage('setNickname')
    setNickname(client: Socket, nickname: string): void {
        client.data.nickname = nickname;
    }

    //채팅방 목록 가져오기
    @SubscribeMessage('getChatRoomList')
    getChatRoomList(client: Socket, payload: any): Observable<chatRoomListDTO> {
        console.log(this.server.sockets.adapter.rooms.keys());
        // return this.server.sockets.adapter.rooms.keys();
        // return this.ChatRoomService.getChatRoomList();
        return from(this.server.sockets.adapter.rooms.keys()).pipe(
            map((room_id) => ({
                room_id,
                room_name: room_id,
                cheif_id: null,
                in_room: [],
            })),
        );
    }

    //채팅방 생성하기
    @SubscribeMessage('createChatRoom')
    createChatRoom(client: Socket, room_name: string): void {
        this.ChatRoomService.createChatRoom(client, room_name);
    }

    //채팅방 들어가기
    @SubscribeMessage('enterChatRoom')
    enterChatRoom(client: Socket, room_id: string) {
        this.ChatRoomService.enterChatRoom(client, room_id);
    }
}
