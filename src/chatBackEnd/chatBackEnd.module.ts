import { Module } from '@nestjs/common';
import { ChatBackEndGateway } from './chatBackEnd.gateway';
import { ChatRoomService } from './chatRoom.service';
import { ClientListService } from './clientList.service';

@Module({
    providers: [ChatBackEndGateway, ClientListService, ChatRoomService],
})
export class ChatBackEndModule {}
