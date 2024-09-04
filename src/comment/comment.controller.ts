import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtGuard } from 'src/auth/guard';
import { createCommentDto, dataParamsCommentDto } from './dto';
import { GetUser } from 'src/auth/decorators';

@UseGuards(JwtGuard)
@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post('/post')
  @HttpCode(200)
  getPostComments(@Body() body: dataParamsCommentDto) {
    return this.commentService.getPostComments(body);
  }

  @Post('')
  createComment(@Body() body: createCommentDto, @GetUser('id') userId: string) {
    return this.commentService.createComment(body, userId);
  }
}
