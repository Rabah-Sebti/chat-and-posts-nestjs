import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorators';
import { User } from '@prisma/client';
import { EditPasswordDto, EditPictureDto, EditUserDto } from './dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getUsers(@GetUser('id') userId: string) {
    return this.userService.getUsers(userId);
  }

  @Get('me')
  getUser(@GetUser() user: User) {
    return user;
  }

  @Patch('edit')
  editUser(@GetUser('id') userId: string, @Body() body: EditUserDto) {
    return this.userService.editUser(userId, body);
  }

  @Patch('client/update-password')
  editPassword(@GetUser('id') userId: string, @Body() body: EditPasswordDto) {
    return this.userService.editPassword(userId, body);
  }

  @Patch('client/update-picture')
  editPicture(@GetUser('id') userId: string, @Body() body: EditPictureDto) {
    return this.userService.editPicture(userId, body);
  }
}
