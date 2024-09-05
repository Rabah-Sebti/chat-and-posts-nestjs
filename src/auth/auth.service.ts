import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, SignUpDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signUp(dto: SignUpDto) {
    try {
      const hash = await argon.hash(dto.password);
      const userExist = await this.prisma.user.findFirst({
        where: {
          email: dto.email,
        },
      });
      if (userExist) throw new BadRequestException('Credentials taken');
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash,
          firstname: dto.firstname,
          lastname: dto.lastname,
        },
      });
      delete user.password;
      // return user;
      const token = await this.signToken(user.id, user.email);
      const res = {
        token,
        user,
      };
      return res;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }
  async signIn(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException('Credentials Incorrect');
    const passMatches = await argon.verify(user.password, dto.password);
    if (!passMatches) throw new ForbiddenException('Credentials Incorrect');
    delete user.password;
    const token = await this.signToken(user.id, user.email);
    const res = {
      token,
      user,
    };

    return res;
  }
  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const token = await this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: '15h',
    });
    return { access_token: token };
  }
}
