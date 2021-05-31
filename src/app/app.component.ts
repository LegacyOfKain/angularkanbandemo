/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component } from '@angular/core';
import { Task } from './task/task';
import { CdkDragDrop, CdkDragEnter, CdkDragExit, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogResult, TaskDialogComponent } from './task-dialog/task-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  todo: Task[] = [
    {
      title: 'Buy milk',
      description: 'Go to the store and buy milk',
      lane: 'todo'
    },
    {
      title: 'Create a Kanban app',
      description: 'Using Firebase and Angular create a Kanban app!',
      lane: 'todo'
    },
  ];
  inProgress: Task[] = [
    {
      title: 'Shaving Beard',
      description: 'Take the razor and shave your beard',
      lane: 'inProgress'
    }
  ];
  done: Task[] = [];
  title: string = 'kanban-fire';

  constructor(private dialog: MatDialog) {}

  newTask(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task: {},
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult) => {
        if (!result) {
          return;
        }
        this.todo.push(result.task);
      });
  }

  editTask(list: 'done' | 'todo' | 'inProgress', task: Task): void { 
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task,
        enableDelete: true,
      },
    });
    dialogRef.afterClosed().subscribe((result: TaskDialogResult) => {
      if (!result) {
        return;
      }

      console.log('editTask id = ' + task.id);
      console.log('editTask title = ' + task.title);
      console.log('editTask description = ' + task.description);
      console.log('editTask lane = ' + task.lane);
      
      console.log('editTask list = ' + list);
      if(list != task.lane)
      {
        console.log('editTask Lane changed');

         
        if(task.lane == 'todo')
        {
          this.todo.push(task);
        }
        else if(task.lane == 'inProgress')
        {
          this.inProgress.push(task);
        }
        else if(task.lane == 'done')
        {
          this.done.push(task);
        }

        if(list == 'todo')
        {
          this.todo=this.todo.filter(item => item.title !== task.title);
        }
        else if(list == 'inProgress')
        {
          this.inProgress=this.inProgress.filter(item => item.title !== task.title);
        }
        else if(list == 'done')
        {
          this.done=this.done.filter(item => item.title !== task.title);
        }
         

      }

      const dataList = this[list];
      const taskIndex = dataList.indexOf(task);
      if (result.delete) {
        dataList.splice(taskIndex, 1);
      } else {
        dataList[taskIndex] = task;
      }
    });
  }

  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
         event.previousIndex,
         event.currentIndex
      );
    }
    else
    {
      console.log(event.previousContainer.id );   
      console.log(event.previousContainer.data );
      console.log(event.previousIndex );
      console.log(event.container.id );
      console.log(event.container.data );
      console.log(event.currentIndex );
      // Do null checking if copying to empty list
      console.log("current title"+event.container.data[event.currentIndex]?.title );
      console.log("current description"+event.container.data[event.currentIndex]?.description );
      console.log("current lane"+event.container.data[event.currentIndex]?.lane );

      console.log('event.container.data.length = '+event.container.data.length );

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      console.log("Transfer Array Completed" );

      console.log("current title"+event.container.data[event.currentIndex].title );
      console.log("current description"+event.container.data[event.currentIndex].description );
      console.log("current lane"+event.container.data[event.currentIndex].lane );

      // Change task lane property to lane id of where it is dragged
      event.container.data[event.currentIndex].lane = event.container.id;

      console.log(event.previousContainer.data );
      console.log(event.container.data );
    }
  }

 
}
