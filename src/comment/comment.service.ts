import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createCommentDto, dataParamsCommentDto } from './dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async getPostComments(data: dataParamsCommentDto) {
    const { postId, page, pageSize } = data;
    const skip = (page - 1) * pageSize;
    const totalComments = await this.prisma.comment.count({
      where: {
        postId,
      },
    });
    const comments = await this.prisma.comment.findMany({
      where: {
        postId,
      },
      skip: skip,
      take: pageSize,
      include: {
        author: true,
      },
    });

    return { comments, totalComments };
  }

  async createComment(data: createCommentDto, userId: string) {
    const comment = await this.prisma.comment.create({
      data: {
        createdBy: userId,
        content: data.content,
        postId: data.postId,
      },
    });
    return comment;
  }
}
