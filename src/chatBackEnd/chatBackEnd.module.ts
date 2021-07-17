import { Module } from '@nestjs/common';
import { ChatBackEndGateway } from './chatBackEnd.gateway';

@Module({
    providers: [ChatBackEndGateway],
})
export class ChatBackEndModule {}
