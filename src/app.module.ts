import { Module } from '@nestjs/common';
import { ChatBackEndModule } from './chatBackEnd/chatBackEnd.module';
import { ChatFrontEndModule } from './chatFrontEnd/chatFrontEnd.module';

@Module({
    imports: [ChatBackEndModule, ChatFrontEndModule],
})
export class AppModule {}
