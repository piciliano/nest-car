import { UsersService } from './../users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async signIn(authDto: AuthDto): Promise<string | {}> {
    const user = await this.usersService.findByEmail(authDto.email);

    if (!user) {
      throw new UnauthorizedException('Unvalid credentials!');
    }

    const result = { sub: user.id, userEmail: user.email };

    return {
      token: await this.jwtService.sign(result),
    };
  }
}
