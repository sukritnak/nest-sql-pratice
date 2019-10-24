import { User } from './../auth/user.entity';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';
// import { Task, TaskStatus } from './task.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
// import * as uuid from 'uuid/v1';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) { }

    getTasks(
        filterDto: GetTasksFilterDto,
        user: User) {
        return this.taskRepository.getTasks(filterDto, user);
    }
    // private tasks: Task[] = [];

    // getAllTasks(): Task[] {
    //     return this.tasks;
    // }

    // getTasksWithFilterd(filterDto: GetTasksFilterDto): Task[] {
    //     const { status, search } = filterDto;
    //     let tasks = this.getAllTasks();

    //     if (status) {
    //         tasks = tasks.filter(task => task.status === status)
    //     }

    //     if (search) {
    //         tasks = tasks.filter(task =>
    //             task.title.includes(search) ||
    //             task.description.includes(search),
    //         );
    //     }
    //     return tasks;
    // }

    async getTaskById(
        id: number,
        user: User): Promise<Task> {
        const found = await this.taskRepository.findOne({where: {id, userId: user.id}});

        if (!found) {
            throw new NotFoundException(`Task with ID "${id}" Not found`);
        }
        return found;

    }
    // getTaskById(id: string): Task {
    //     const found = this.tasks.find(tasks => tasks.id === id);

    //     if (!found) {
    //         throw new NotFoundException(`Task with ID "${id}" Not found`);
    //     }
    //     return found;
    // }

    async createTask(
        createTaskDto: CreateTaskDto,
        user: User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    // creatTask(createTaskDto: CreateTaskDto): Task {
    //     const { title, description } = createTaskDto;s
    //     const task: Task = {
    //         id: uuid(),
    //         title,
    //         description,
    //         status: TaskStatus.OPEN,
    //     };
    //     this.tasks.push(task);
    //     return task;
    // }

    async deleteTask(id: number, user: User): Promise<void> {
        const result = await this.taskRepository.delete({ id, userId: user.id});
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" Not found`);
        }
    }
    // deleteTask(id: string): void {
    //     const found = this.getTaskById(id);
    //     this.tasks = this.tasks.filter(tasks => tasks.id !== found.id);
    // }

    async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
       const task = await this.getTaskById(id, user);
       task.status = status;
       await task.save();
       return task;
    }
    // updateTaskStatus(id: string, status: TaskStatus): Task {
    //     const task = this.getTaskById(id);
    //     task.status = status;
    //     return task;
    // }
}
