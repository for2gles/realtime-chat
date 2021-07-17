import { Module } from '@nestjs/common';
import { ChatFrontEndController } from './chatFrontEnd.controller';

@Module({
    controllers: [ChatFrontEndController],
})
export class ChatFrontEndModule {}
