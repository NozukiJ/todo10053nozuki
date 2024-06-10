// calendar.component.ts
import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { startOfDay, endOfDay } from 'date-fns';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  events: CalendarEvent[] = [];

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.todoService.getTodos().subscribe((todos: Todo[]) => {
      this.events = todos.map(todo => {
        const dueDate = todo.dueDate ? (todo.dueDate as firebase.firestore.Timestamp).toDate() : null;
        return {
          title: todo.title,
          start: dueDate ? startOfDay(dueDate) : new Date(),
          end: dueDate ? endOfDay(dueDate) : new Date(),
          color: { primary: '#e3bc08', secondary: '#FDF1BA' },
        };
      });
    }, (error: any) => {
      console.error('Error fetching todos:', error);
    });
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: { primary: '#e3bc08', secondary: '#FDF1BA' },
      },
    ];
  }
}
