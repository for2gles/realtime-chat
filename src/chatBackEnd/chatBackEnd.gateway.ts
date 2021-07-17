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
import { setInitDTO } from './dto/chatBackEnd.dto';

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
        for (const [id, thisClient] of Object.entries(
            this.ClientListService.getClient(),
        )) {
            thisClient.emit('getMessage', {
                id: client.id,
                nickname: thisClient.data.nickname,
                message,
            });
        }
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
}
