import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';
import firebase from 'firebase/compat/app';

interface FilterCriteria {
  key: keyof Todo | 'all';
  value: string;
}

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  displayedTodos: Todo[] = [];
  sortCriteria: keyof Todo = 'createdAt'; // 初期ソート基準
  filterCriteria: FilterCriteria[] = []; // 初期フィルタ基準

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.todoService.getTodos().then(todos => {
      this.todos = this.sortTodos(todos, this.sortCriteria);
      this.applyFilters();
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
    if (!title && !description && !dueDateTime && tags.length === 0 && !priority && !location) {
      console.error('At least one field is required');
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

  sortTodos(todos: Todo[], criteria: keyof Todo): Todo[] {
    return todos.sort((a, b) => {
      const aValue = a[criteria];
      const bValue = b[criteria];

      // aValueとbValueがnullまたはundefinedの場合の処理
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (aValue < bValue) {
        return -1;
      } else if (aValue > bValue) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  applyFilters(): void {
    let filteredTodos = this.todos;

    this.filterCriteria.forEach(criteria => {
      if (criteria.key === 'all' || criteria.value === '' || criteria.value === 'all') {
        return;
      }

      filteredTodos = filteredTodos.filter(todo => {
        if (criteria.key === 'completed') {
          const completedValue = criteria.value === 'true';
          return todo.completed === completedValue;
        } else {
          const value = todo[criteria.key as keyof Todo];
          if (Array.isArray(value)) {
            return value.includes(criteria.value);
          }
          return value === criteria.value;
        }
      });
    });

    this.displayedTodos = filteredTodos;
  }

  onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const criteria = target.value as keyof Todo;
    this.sortCriteria = criteria;
    this.todos = this.sortTodos(this.todos, criteria);
    this.applyFilters();
  }

  onFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement | HTMLInputElement;
    const key = target.name as keyof Todo | 'all';
    const value = target.value;

    // フィルタ基準を更新または追加
    const existingCriteria = this.filterCriteria.find(criteria => criteria.key === key);
    if (existingCriteria) {
      existingCriteria.value = value;
    } else {
      this.filterCriteria.push({ key, value });
    }

    this.applyFilters();
  }
}
