import { Global, Module } from '@nestjs/common';
import { ChatGateway } from './events.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Global()
@Module({
  //   imports: [AuthModule],
  providers: [ChatGateway, JwtService],
  exports: [ChatGateway],
})
export class EventsModule {}
