import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Task } from './tasks.model';
import { Users } from './users.model';
import { Tags } from './tags.model';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  boardChanged = new Subject<any>();
  usersChanged = new Subject<Users>();
  tagsChanged = new Subject<Tags>();

  private tasks: Task[] = [];
  private users: Users | [] = [];
  private tags: Tags | [] = [];

  setBoard(tasks: Task[]) {
    this.tasks = tasks;
    this.boardChanged.next([...this.tasks]);
  }

  getBoard() {
    return { ...this.tasks };
  }

  getTask(id: number): Task | undefined {
    return this.tasks.find((task) => {
      return task.id === id;
    });
  }

  setTask(task: Task) {
    this.tasks.push(task);
    this.boardChanged.next([...this.tasks]);
  }

  updateTask(newTask: Task) {
    const foundIndex = this.tasks.findIndex((task) => task.id === newTask.id);
    this.tasks[foundIndex] = newTask;
    this.boardChanged.next([...this.tasks]);
  }

  setUsers(users: Users) {
    this.users = users;
    this.usersChanged.next([...this.users]);
  }

  getAllUsers() {
    return { ...this.users };
  }

  setTags(tags: Tags) {
    this.tags = tags;
    this.tagsChanged.next([...this.tags]);
  }
}
