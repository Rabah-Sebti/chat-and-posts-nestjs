import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EditPasswordDto, EditPictureDto, EditUserDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers(userId: string) {
    const users = await this.prisma.user.findMany({
      where: {
        id: {
          not: userId,
        },
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        picture: true,
      },
    });
    const usersWithUnreadMessages = await Promise.all(
      users.map(async (user) => {
        const unreadMessages = await this.prisma.message.count({
          where: {
            senderId: user.id,
            receiverId: userId,
            read: false,
          },
        });
        return {
          ...user,
          unreadMessages,
        };
      }),
    );
    return usersWithUnreadMessages;
  }

  async editUser(userId: string, body: EditUserDto) {
    const newUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...body,
      },
    });
    delete newUser.password;
    return newUser;
  }

  async editPassword(userId: string, body: EditPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!user) throw new NotFoundException('User Not Found');
    const passMatches = await argon.verify(user.password, body.oldPassword);
    if (!passMatches) throw new ForbiddenException('Credentials Incorrect');
    const hash = await argon.hash(body.newPassword);
    const newUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hash,
      },
    });
    delete newUser.password;
    return { message: 'Password updated with success' };
  }

  async editPicture(userId: string, body: EditPictureDto) {
    const newUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        picture: body.picture,
      },
    });
    return newUser;
  }
}
