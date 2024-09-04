import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { JwtService } from '@nestjs/jwt';
import { MessageModule } from './message/message.module';
import { EventsModule } from './chat/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    PrismaModule,
    PostModule,
    CommentModule,
    MessageModule,
    EventsModule,
  ],
  providers: [JwtService],
})
export class AppModule {}
