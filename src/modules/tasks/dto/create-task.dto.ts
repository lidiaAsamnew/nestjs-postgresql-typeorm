export class CreateTaskDto {
  title!: string;
  description?: string;
  projectId!: string;
  assigneeId?: string;
}

