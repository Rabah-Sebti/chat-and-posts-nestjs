import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorators';
import { CreatePostDto, EditPostDto } from './dto';

@UseGuards(JwtGuard)
@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}
  @Post()
  createPost(@Body() body: CreatePostDto, @GetUser('id') userId: string) {
    return this.postService.createPost(body, userId);
  }

  @Get()
  getPosts(
    @Query('search') search: string,
    @Query(
      'page',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    page: number,
    @Query(
      'pageSize',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    pageSize: number,
  ) {
    return this.postService.getAllPosts(search, page, pageSize);
  }

  @Get(':id/user-posts')
  getPostsById(
    @Param('id')
    userId: string,
    @Query(
      'page',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    page: number,
    @Query(
      'pageSize',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    pageSize: number,
  ) {
    return this.postService.getAllPostsById(userId, page, pageSize);
  }

  @Get(':id')
  getPostById(
    @GetUser('id') userId: string,
    @Param('id')
    id: string,
  ) {
    return this.postService.getOnePost(userId, id);
  }

  @Patch(':id')
  updateBookmark(
    @GetUser('id') userId: string,
    @Param('id')
    id: string,
    @Body() body: EditPostDto,
  ) {
    return this.postService.updatePost(userId, id, body);
  }

  @Post(':id/like')
  likePost(
    @GetUser('id') userId: string,
    @Param('id')
    id: string,
  ) {
    return this.postService.likePost(userId, id);
  }

  @Delete(':id')
  deletePost(@GetUser('id') userId: string, @Param('id') postId: string) {
    return this.postService.deletePost(userId, postId);
  }
}
