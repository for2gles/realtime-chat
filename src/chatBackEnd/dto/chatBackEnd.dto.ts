import { Socket } from 'socket.io';
export class setInitDTO {
    nickname: string;
}

export class chatRoomListDTO {
    room_id: string;
    cheif_id: string;
    room_name: string;
    in_room: string[];
}
