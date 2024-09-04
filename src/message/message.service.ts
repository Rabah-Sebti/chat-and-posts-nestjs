import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateMessageDto,
  dataParamsMessageDto,
  UpdateMessageDto,
} from './dto/message.dto';
import { ChatGateway } from 'src/chat/events.gateway';

@Injectable()
export class MessageService {
  constructor(
    private prisma: PrismaService,
    private chatGateway: ChatGateway,
  ) {}
  async getMessages(body: dataParamsMessageDto, userId: string) {
    const { to, page, pageSize } = body;
    const totalMessages = await this.prisma.message.count({
      where: {
        users: {
          hasEvery: [userId, to],
        },
      },
    });

    const messages = await this.prisma.message.findMany({
      where: {
        users: {
          hasEvery: [userId, to],
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const sortedMessages = messages.sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    );

    return { messages: sortedMessages, totalMessages };
  }

  async createMessage(body: CreateMessageDto, userId: string) {
    const { text, to } = body;
    const message = await this.prisma.message.create({
      data: {
        text,
        senderId: userId,
        receiverId: to,
        users: [userId, to],
      },
    });
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        firstname: true,
        lastname: true,
      },
    });
    delete message.users;

    this.chatGateway.sendMessageToUser(to, { data: message, user });
    return message;
  }

  async getAllUnreadMessages(userId) {
    const totalMessages = await this.prisma.message.count({
      where: {
        receiverId: userId,
        read: false,
      },
    });
    return { unread_messages: totalMessages };
  }

  async updateUnreadMessages(body: UpdateMessageDto, userId: string) {
    const response = await this.prisma.message.updateMany({
      where: {
        senderId: body.sender,
        receiverId: userId,
        read: false,
      },
      data: {
        read: true,
      },
    });
    return response;
  }
}
