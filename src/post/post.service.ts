import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto, EditPostDto } from './dto';
import { isMongoId } from 'class-validator';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async createPost(dto: CreatePostDto, userId: string) {
    const post = await this.prisma.post.create({
      data: {
        content: dto.content,
        tag: dto.tag,
        createdBy: userId,
      },
    });
    return post;
  }

  async getAllPostsById(userId: string, page: number, pageSize: number) {
    const skip = page * pageSize;
    const posts = await this.prisma.post.findMany({
      where: {
        createdBy: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            picture: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      take: pageSize,
      skip,
    });
    return posts;
  }

  async getAllPosts(search: string, page: number, pageSize: number) {
    const skip = page * pageSize;
    const totalPosts = await this.prisma.post.count({
      where: {
        OR: [
          {
            content: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            tag: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
    const posts = await this.prisma.post.findMany({
      where: {
        OR: [
          {
            content: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            tag: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      },

      include: {
        author: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            picture: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      skip,
      take: pageSize,
    });
    return { posts, totalPosts };
  }
  async getOnePost(userId: string, postId: string) {
    try {
      if (!isMongoId(postId)) {
        throw new BadRequestException('Invalid ID format');
      }
      const post = await this.prisma.post.findFirst({
        where: {
          createdBy: userId,
          id: postId,
        },
      });
      if (!post) throw new NotFoundException('Bookmark not exist');
      return post;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }

  async updatePost(userId: string, postId: string, body: EditPostDto) {
    if (!isMongoId(postId)) {
      throw new BadRequestException('Invalid ID format');
    }
    const post = await this.prisma.post.findFirst({
      where: {
        createdBy: userId,
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException('Post does not exist');
    }
    const newPost = await this.prisma.post.update({
      where: {
        id: postId,
      },
      data: { ...body },
    });

    return newPost;
  }

  async likePost(userId: string, postId: string) {
    if (!isMongoId(postId)) {
      throw new BadRequestException('Invalid ID format');
    }
    const post = await this.prisma.post.findFirst({
      where: {
        id: postId,
      },
      select: {
        likes: true,
      },
    });
    if (!post) {
      throw new NotFoundException('Post Not Found');
    }
    let newLikes = [];
    const { likes } = post;
    if (likes.includes(userId)) {
      newLikes = likes.filter((item) => item !== userId);
    } else {
      newLikes = [...likes, userId];
    }
    const updatedPost = await this.prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        likes: newLikes,
      },
      select: {
        likes: true,
      },
    });
    // return updatedPost;
    return { post: updatedPost, likes: updatedPost.likes.length };
  }

  async deletePost(userId: string, postId: string) {
    if (!isMongoId(postId)) {
      throw new BadRequestException('Invalid ID format');
    }

    const post = await this.prisma.post.findFirst({
      where: {
        id: postId,
        createdBy: userId,
      },
    });
    if (!post) throw new NotFoundException('Post not found');

    const deletedPost = await this.prisma.post.delete({
      where: {
        id: postId,
      },
    });
    return deletedPost;
  }
}
