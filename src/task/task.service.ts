import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async createTask(title: string, description: string, userId: string): Promise<Task> {
    if (!userId) {
      throw new Error('userId must be provided');
    }
    
    return this.prisma.task.create({
      data: {
        title,
        description,
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  async getTasks(userId: string): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { user_id: userId },
    });
  }

  async getTaskById(id: string, userId: string): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });
    
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    
    if (task.user_id !== userId) {
      throw new ForbiddenException('Access to this task is forbidden');
    }

    return task;
  }

  async updateTask(id: string, title: string, description: string, userId: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });
    
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.user_id !== userId) {
      throw new ForbiddenException('Access to this task is forbidden');
    }

    return this.prisma.task.update({
      where: { id },
      data: { title, description },
    });
  }

  async deleteTask(id: string, userId: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });
    
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.user_id !== userId) {
      throw new ForbiddenException('Access to this task is forbidden');
    }

    return this.prisma.task.delete({
      where: { id },
    });
  }
}
