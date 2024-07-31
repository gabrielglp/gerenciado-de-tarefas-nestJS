import { Controller, Get, Post, Put, Delete, Param, Body, Request } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from '@prisma/client';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createTask(
    @Body('title') title: string,
    @Body('description') description: string,
    @Request() req: any
  ): Promise<Task> {
    const userId = req.user.id;
    return this.taskService.createTask(title, description, userId);
  }

  @Get()
  async getTasks(@Request() req: any): Promise<Task[]> {
    const userId = req.user.id;
    return this.taskService.getTasks(userId);
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string, @Request() req: any): Promise<Task> {
    const userId = req.user.id;
    return this.taskService.getTaskById(id, userId);
  }

  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body('title') title: string,
    @Body('description') description: string,
    @Request() req: any
  ): Promise<Task> {
    const userId = req.user.id;
    return this.taskService.updateTask(id, title, description, userId);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string, @Request() req: any): Promise<Task> {
    const userId = req.user.id;
    return this.taskService.deleteTask(id, userId);
  }
}
