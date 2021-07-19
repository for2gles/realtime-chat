import { Injectable } from '@nestjs/common';
import { chatRoomListDTO } from './dto/chatBackEnd.dto';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { ClientListService } from './clientList.service';

@Injectable()
export class ChatRoomService {
    private chatRoomList: Record<string, chatRoomListDTO>;
    constructor(private readonly ClientListService: ClientListService) {
        this.chatRoomList = {};
    }
    createChatRoom(client: Socket, room_name: string): void {
        const room_id = `room:${uuidv4()}`;
        // this.chatRoomList[room_id] = {
        //     room_id,
        //     cheif_id: client.id,
        //     room_name,
        //     in_room: [client.id],
        // };
        // client.data.room_id = room_id;
        const nickname: string = client.data.nickname;
        client.emit('getMessage', {
            id: null,
            nickname: '안내',
            message:
                '"' +
                nickname +
                '"님이 "' +
                room_name +
                '"방을 생성하였습니다.',
        });
        // return this.chatRoomList[room_id];
        client.rooms.clear();
        client.join(room_id);
    }

    enterChatRoom(client: Socket, room_id: string) {
        client.rooms.clear();
        client.join(room_id);
        const { nickname } = client.data;
        client.to(room_id).emit('getMessage', {
            id: null,
            nickname: '안내',
            message: '"' + nickname + '"님이 방에 접속하셨습니다.',
        });
        // client.data.room_id = room_id;
        // this.chatRoomList[room_id].in_room.push(client.id);
        // const { nickname } = client.data;
        // for (const thisClientId of this.chatRoomList[room_id].in_room) {
        //     this.ClientListService.getClient(thisClientId).emit('getMessage', {
        //         id: null,
        //         nickname: '안내',
        //         message: '"' + nickname + '"님이 방에 접속하셨습니다.',
        //     });
        // }
    }

    exitChatRoom(client: Socket, room_id: string) {
        client.rooms.clear();
        client.join(`room:lobby`);
        const { nickname } = client.data;
        client.to(room_id).emit('getMessage', {
            id: null,
            nickname: '안내',
            message: '"' + nickname + '"님이 방에서 나갔습니다.',
        });
        // delete client.data.room_id;
        // const index = this.chatRoomList[room_id].in_room.indexOf(client.id);
        // this.chatRoomList[room_id].in_room.splice(index, 1);
        // const { nickname } = client.data;
        // for (const thisClientId of this.chatRoomList[room_id].in_room) {
        //     this.ClientListService.getClient(thisClientId).emit('getMessage', {
        //         id: null,
        //         nickname: '안내',
        //         message: '"' + nickname + '"님이 방에서 나갔습니다.',
        //     });
        // }
    }

    getChatRoom(room_id: string): chatRoomListDTO {
        return this.chatRoomList[room_id];
    }

    getChatRoomList(): Record<string, chatRoomListDTO> {
        return this.chatRoomList;
    }
}
