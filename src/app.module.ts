import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { ChatModule } from './chat/chat.module';

@Module({
    imports: [EventsModule, ChatModule],
})
export class AppModule {}
