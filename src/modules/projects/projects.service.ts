import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../users/entities/user.entity';
import {
  CreateProjectDto,
  CreateProjectWithFirstTaskDto,
} from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Project)
    private readonly projectsRepo: Repository<Project>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(Task) private readonly tasksRepo: Repository<Task>,
  ) {}

  async create(dto: CreateProjectDto): Promise<Project> {
    const owner = await this.usersRepo.findOne({ where: { id: dto.ownerId } });
    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    const project = this.projectsRepo.create({
      name: dto.name,
      description: dto.description ?? null,
      owner,
    });
    return await this.projectsRepo.save(project);
  }

  async createWithFirstTask(
    dto: CreateProjectWithFirstTaskDto,
  ): Promise<{ project: Project; firstTask: Task }> {
    return await this.dataSource.transaction(async (manager) => {
      const owner = await manager.getRepository(User).findOne({
        where: { id: dto.ownerId },
      });
      if (!owner) {
        throw new NotFoundException('Owner not found');
      }

      const projectRepo = manager.getRepository(Project);
      const taskRepo = manager.getRepository(Task);

      const project = projectRepo.create({
        name: dto.name,
        description: dto.description ?? null,
        owner,
      });
      const savedProject = await projectRepo.save(project);

      const firstTask = taskRepo.create({
        title: dto.firstTaskTitle,
        description: dto.firstTaskDescription ?? null,
        status: 'todo',
        project: savedProject,
        assignee: null,
      });
      const savedTask = await taskRepo.save(firstTask);

      return { project: savedProject, firstTask: savedTask };
    });
  }

  async findAll(): Promise<Project[]> {
    return await this.projectsRepo
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.owner', 'owner')
      .leftJoinAndSelect('project.tasks', 'task')
      .orderBy('project.createdAt', 'DESC')
      .addOrderBy('task.createdAt', 'ASC')
      .getMany();
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepo.findOne({
      where: { id },
      relations: { owner: true, tasks: true },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async update(id: string, dto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);
    project.name = dto.name ?? project.name;
    project.description =
      dto.description === undefined ? project.description : dto.description;
    return await this.projectsRepo.save(project);
  }

  async remove(id: string): Promise<{ deleted: true }> {
    const project = await this.projectsRepo.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    await this.projectsRepo.remove(project);
    return { deleted: true };
  }
}

