import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.usersRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const user = this.usersRepo.create({
      email: dto.email,
      name: dto.name,
    });
    return await this.usersRepo.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<User | null> {
    return await this.usersRepo.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.email && dto.email !== user.email) {
      const existing = await this.usersRepo.findOne({
        where: { email: dto.email },
      });
      if (existing) {
        throw new ConflictException('Email already exists');
      }
      user.email = dto.email;
    }

    if (dto.name !== undefined) {
      user.name = dto.name;
    }

    return await this.usersRepo.save(user);
  }
}

