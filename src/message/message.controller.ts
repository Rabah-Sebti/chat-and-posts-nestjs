import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import {
  CreateMessageDto,
  dataParamsMessageDto,
  UpdateMessageDto,
} from './dto/message.dto';
import { GetUser } from 'src/auth/decorators';
import { MessageService } from './message.service';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageService) {}
  @Post()
  getMessages(
    @Body() body: dataParamsMessageDto,
    @GetUser('id') userId: string,
  ) {
    return this.messageService.getMessages(body, userId);
  }

  @Post('add-message')
  createMessage(@Body() body: CreateMessageDto, @GetUser('id') userId: string) {
    return this.messageService.createMessage(body, userId);
  }

  @Get('unread-messages')
  getAllUnreadMessages(@GetUser('id') userId: string) {
    return this.messageService.getAllUnreadMessages(userId);
  }

  @Patch('update-messages')
  updateMessages(
    @Body() body: UpdateMessageDto,
    @GetUser('id') userId: string,
  ) {
    return this.messageService.updateUnreadMessages(body, userId);
  }
}
