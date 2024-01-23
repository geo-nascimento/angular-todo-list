import { Injectable, signal } from '@angular/core';
import { Todo } from '../models/model/Todo.model';
import { TodoKeyLocalStorage } from '../models/enums/todoKeyLocalStorage';

@Injectable({
  	providedIn: 'root'
})
export class TodoSignalService {

	//Criar um signal -> nesse caso tipado como array, mas ele pode conter vários tipos diferentes
	todoState = signal<Array<Todo>>([]);


	//Métodos para a manipulação de signals da aplicação
	updateTodo({id, title, description, done}:Todo):void {
		if ((title && id && description !== null) || undefined) {
			this.todoState.update((todo:Todo[]) => {
				if (todo !== null) {
					todo.push(new Todo(id, title, description, done))
					this.saveTodosInLocalStorage()
				}

				return todo
			});
		}
	}

	saveTodosInLocalStorage():void {
		const todos = JSON.stringify(this.todoState());
		todos && localStorage.setItem(TodoKeyLocalStorage.TODO_LIST,todos);
	}
}
