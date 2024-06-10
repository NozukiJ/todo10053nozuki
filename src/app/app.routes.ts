import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { CalendarComponent } from './components/calendar/calendar.component'; // 追加

export const routes: Routes = [
  { path: '', component: TodoListComponent },
  { path: 'calendar', component: CalendarComponent }, // 追加
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
