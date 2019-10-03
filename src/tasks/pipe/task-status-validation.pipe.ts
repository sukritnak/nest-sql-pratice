// import { TaskStatus } from './../task.model';
// import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { PipeTransform, BadRequestException } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';
export class TaskStatusValidationPipe implements PipeTransform {
    // transform(value: any, metadata: ArgumentMetadata) {
    //     console.log('value', value);
    //     console.log('metadata', metadata);

    //     return value;

    // }
    readonly allowedStatues = [
        TaskStatus.DONE,
        TaskStatus.IN_PROGRESS,
        TaskStatus.OPEN,
    ];

    transform(value: any) {
        value = value.toUpperCase();
        if (!this.isStatusValid(value)) {
            throw new BadRequestException(`"${value}" is an invalid status`);
        }

        return value;
    }

    private isStatusValid(status: any) {
        const idx = this.allowedStatues.indexOf(status);
        // tslint:disable-next-line: no-console
        console.log(idx);
        return idx !== -1;
    }
}
