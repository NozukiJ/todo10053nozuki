import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.todoService.getTodos().then(todos => {
      this.todos = todos;
      console.log('Todos fetched:', todos);
    }).catch(error => {
      console.error('Error fetching todos:', error);
    });
  }

  addTodo(
    title: string,
    description: string,
    dueDateTime: string | null,
    tags: string[],
    priority: string,
    location: string
  ): void {
    if (!title || !description) {
      console.error('Title and description are required');
      return;
    }

    let dueDate: firebase.firestore.Timestamp | null = null;
    if (dueDateTime) {
      dueDate = firebase.firestore.Timestamp.fromDate(new Date(dueDateTime));
    }

    const priorityValue: 'high' | 'medium' | 'low' = priority as 'high' | 'medium' | 'low';

    const newTodo: Todo = {
      title,
      description,
      completed: false,
      createdAt: firebase.firestore.Timestamp.now(),
      dueDate,
      tags,
      priority: priorityValue,
      location
    };
    console.log('Adding todo:', newTodo);

    this.todoService.addTodo(newTodo)
      .then(() => {
        console.log('Todo added successfully');
        this.loadTodos();
      })
      .catch(error => {
        console.error('Error adding todo:', error);
      });
  }

  deleteTodo(id: string | undefined): void {
    if (id) {
      this.todoService.deleteTodo(id)
        .then(() => {
          console.log('Todo deleted successfully');
          this.loadTodos();
        })
        .catch(error => {
          console.error('Error deleting todo:', error);
        });
    } else {
      console.error('Error: ID is undefined');
    }
  }

  toggleCompletion(todo: Todo): void {
    todo.completed = !todo.completed;
    if (todo.id) {
      this.todoService.updateTodo(todo)
        .then(() => {
          console.log('Todo updated successfully');
          this.loadTodos();
        })
        .catch(error => {
          console.error('Error updating todo:', error);
        });
    } else {
      console.error('Error: Todo ID is undefined');
    }
  }

  updateTodo(updatedTodo: Todo): void {
    if (updatedTodo.id) {
      this.todoService.updateTodo(updatedTodo)
        .then(() => {
          console.log('Todo updated successfully');
          this.loadTodos();
        })
        .catch(error => {
          console.error('Error updating todo:', error);
        });
    } else {
      console.error('Error: Todo ID is undefined');
    }
  }
}
