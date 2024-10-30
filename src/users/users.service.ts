import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user-entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create({ name, password, email }: CreateUserDto) {
    try {
      const userEmailExists = await this.findByEmail(email);

      if (userEmailExists) {
        throw new ConflictException('Email already in use', {
          cause: new Error(),
        });
      }

      const user = this.userRepository.create({
        name,
        password,
        email,
      });

      await this.userRepository.save(user);
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error.',
        error.status || 500,
      );
    }
  }

  async findAll() {
    try {
      const users = await this.userRepository.find();

      return {
        count: users.length,
        data: users,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error.',
        error.status || 500,
      );
    }
  }

  async findByEmail(email: string) {
    try {
      const userFindByEmail = await this.userRepository.findOne({
        where: { email }
      });

      return userFindByEmail || null;
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error.',
        error.status || 500,
      );
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['cars'],
      });

      if (!user) {
        throw new NotFoundException();
      }

      return user;
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error.',
        error.status || 500,
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.findOne(id);

      if (!user) {
        throw new NotFoundException();
      }

      const updateUser = this.userRepository.merge(user, updateUserDto);

      await this.userRepository.save(updateUser);
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error.',
        error.status || 500,
      );
    }
  }

  async remove(id: string) {
    try {
      const user = await this.findOne(id);

      if (!user) {
        throw new NotFoundException();
      }

      await this.userRepository.delete(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error.',
        error.status || 500,
      );
    }
  }
}
