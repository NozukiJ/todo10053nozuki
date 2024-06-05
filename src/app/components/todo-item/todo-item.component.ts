import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Todo } from '../../models/todo.model';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() delete = new EventEmitter<string>();
  @Output() toggleCompletion = new EventEmitter<void>();
  @Output() update = new EventEmitter<Todo>();

  editMode = false;
  editTitle = '';
  editDescription = '';
  editDueDateTime: string | null = null;
  editTags = '';
  editPriority: 'high' | 'medium' | 'low' = 'low';
  editLocation = '';

  onDelete(): void {
    this.delete.emit(this.todo.id);
  }

  onToggleCompletion(): void {
    this.toggleCompletion.emit();
  }

  onEdit(): void {
    this.editMode = true;
    this.editTitle = this.todo.title;
    this.editDescription = this.todo.description;
    this.editDueDateTime = this.todo.dueDate ? this.todo.dueDate.toDate().toISOString().slice(0, 16) : null;
    this.editTags = this.todo.tags.join('、');
    this.editPriority = this.todo.priority;
    this.editLocation = this.todo.location;
  }

  onSave(): void {
    const updatedTodo: Todo = {
      ...this.todo,
      title: this.editTitle,
      description: this.editDescription,
      dueDate: this.editDueDateTime ? firebase.firestore.Timestamp.fromDate(new Date(this.editDueDateTime)) : null,
      tags: this.editTags.split('、').map(tag => tag.trim()),
      priority: this.editPriority,
      location: this.editLocation
    };
    this.update.emit(updatedTodo);
    this.editMode = false;
  }

  onCancel(): void {
    this.editMode = false;
  }

  toggleExpand(event: Event): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('todo-detail')) {
      target.classList.toggle('expanded');
    }
  }
}
