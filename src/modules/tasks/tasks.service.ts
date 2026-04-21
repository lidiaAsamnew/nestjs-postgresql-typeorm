import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly tasksRepo: Repository<Task>,
    @InjectRepository(Project)
    private readonly projectsRepo: Repository<Project>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async create(dto: CreateTaskDto): Promise<Task> {
    const project = await this.projectsRepo.findOne({
      where: { id: dto.projectId },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const assignee = dto.assigneeId
      ? await this.usersRepo.findOne({ where: { id: dto.assigneeId } })
      : null;

    if (dto.assigneeId && !assignee) {
      throw new NotFoundException('Assignee not found');
    }

    const task = this.tasksRepo.create({
      title: dto.title,
      description: dto.description ?? null,
      status: 'todo',
      project,
      assignee,
    });
    return await this.tasksRepo.save(task);
  }

  async findAll(): Promise<Task[]> {
    return await this.tasksRepo.find({
      relations: { project: true, assignee: true },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.tasksRepo.findOne({
      where: { id },
      relations: { project: true, assignee: true },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (dto.title !== undefined) {
      task.title = dto.title;
    }
    if (dto.description !== undefined) {
      task.description = dto.description;
    }
    if (dto.status !== undefined) {
      task.status = dto.status;
    }

    if (dto.assigneeId !== undefined) {
      if (dto.assigneeId === null) {
        task.assignee = null;
      } else {
        const assignee = await this.usersRepo.findOne({
          where: { id: dto.assigneeId },
        });
        if (!assignee) {
          throw new NotFoundException('Assignee not found');
        }
        task.assignee = assignee;
      }
    }

    return await this.tasksRepo.save(task);
  }
}

