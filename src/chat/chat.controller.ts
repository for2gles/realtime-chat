import { Controller, Get, Render } from '@nestjs/common';

@Controller('chat')
export class ChatController {
    @Get()
    @Render('index')
    root() {
        return { message: 'Hello world!' };
    }
}
