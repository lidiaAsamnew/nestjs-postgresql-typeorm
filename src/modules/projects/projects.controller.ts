import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import {
  CreateProjectDto,
  CreateProjectWithFirstTaskDto,
} from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(@Body() dto: CreateProjectDto) {
    return await this.projectsService.create(dto);
  }

  @Post('with-first-task')
  async createWithFirstTask(@Body() dto: CreateProjectWithFirstTaskDto) {
    return await this.projectsService.createWithFirstTask(dto);
  }

  @Get()
  async findAll() {
    return await this.projectsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.projectsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return await this.projectsService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.projectsService.remove(id);
  }
}

