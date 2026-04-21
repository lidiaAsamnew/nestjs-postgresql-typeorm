export class CreateProjectDto {
  name!: string;
  description?: string;
  ownerId!: string;
}

export class CreateProjectWithFirstTaskDto {
  name!: string;
  description?: string;
  ownerId!: string;
  firstTaskTitle!: string;
  firstTaskDescription?: string;
}

