import { Socket } from 'socket.io';
export class setInitDTO {
    nickname: string;
    room: {
        roomId: string;
        roomName: string;
    };
}

export class chatRoomListDTO {
    roomId: string;
    cheifId: string;
    roomName: string;
}
