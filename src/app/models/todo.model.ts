import firebase from 'firebase/compat/app';

export interface Todo {
  id?: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: firebase.firestore.Timestamp;
  dueDate: firebase.firestore.Timestamp | null;
  tags: string[];
  priority: 'high' | 'medium' | 'low';  // 優先度フィールドを文字列型に変更
  location: string;
}


