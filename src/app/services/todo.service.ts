import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Todo } from '../models/todo.model';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todosCollection = this.firestore.collection<Todo>('todos');

  constructor(private firestore: AngularFirestore) {}

  getTodos(): Observable<Todo[]> {
    const todosPromise = this.todosCollection.ref.orderBy('createdAt').get().then(querySnapshot => {
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as Todo;
        data.id = doc.id;
        return data;
      });
    });

    return from(todosPromise);
  }

  addTodo = (todo: Todo): Promise<void> => {
    const id = this.firestore.createId();
    todo.createdAt = firebase.firestore.Timestamp.now();
    todo.dueDate = todo.dueDate ? todo.dueDate : null;
    console.log('Generated ID:', id);

    return this.todosCollection.doc(id).set({ ...todo, id })
      .then(() => {
        console.log('Todo added successfully with ID:', id);
      })
      .catch(error => {
        console.error('Error adding todo:', error.message, error);
        throw error;
      });
  }

  deleteTodo = (id: string): Promise<void> => {
    return this.todosCollection.doc(id).delete()
      .then(() => {
        console.log('Todo deleted successfully with ID:', id);
      })
      .catch(error => {
        console.error('Error deleting todo:', error.message, error);
        throw error;
      });
  }

  updateTodo = (todo: Todo): Promise<void> => {
    return this.todosCollection.doc(todo.id).update(todo)
      .then(() => {
        console.log('Todo updated successfully with ID:', todo.id);
      })
      .catch(error => {
        console.error('Error updating todo:', error.message, error);
        throw error;
      });
  }
}
