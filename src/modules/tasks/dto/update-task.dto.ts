import { TaskStatus } from '../entities/task.entity';

export class UpdateTaskDto {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  assigneeId?: string | null;
}

