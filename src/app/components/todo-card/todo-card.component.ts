import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs'
import { TodoSignalService } from '../../services/todo-signal.service';
import { TodoKeyLocalStorage } from '../../models/enums/todoKeyLocalStorage';
import { Todo } from '../../models/model/Todo.model';

@Component({
  selector: 'app-todo-card',
  standalone: true,
  imports: [
	CommonModule,
	MatCardModule,
	MatButtonModule,
	MatIconModule,
	MatTabsModule
],
  templateUrl: './todo-card.component.html',
})
export class TodoCardComponent implements OnInit {
	//Serviço de todo
	private todoSignalService = inject(TodoSignalService);
	//Signal que contem o array das tarefas
	private todoSignal = this.todoSignalService.todoState;
	//Lista de todos computadas que escutas as alterações do signal e depende delas
	public todoList = computed(() => this.todoSignal());



	ngOnInit(): void {
		this.getTodoInLocalStorage()
	}

	private getTodoInLocalStorage():void {
		const todoDatas = localStorage.getItem(TodoKeyLocalStorage.TODO_LIST) as string;
		todoDatas && (this.todoSignal.set(JSON.parse(todoDatas)))
	}

	private saveTodoInLocalStorage():void {
		this.todoSignalService.saveTodosInLocalStorage();
	}

	public handleDoneTodo(todoId:number):void {
		if (todoId) {
			this.todoSignal.update((todo) => {
				const todoSelected = todo.find((todo) => todo?.id === todoId) as Todo
				todoSelected && (todoSelected.done = true);
				this.saveTodoInLocalStorage();
				return todo;
			})
		}
	}

	public handleDeleteTodo(todo:Todo):void {
		if (todo) {
			const index = this.todoList().indexOf(todo);

			if (index !== -1) {
				this.todoSignal.update((todos) => {
					todos.splice(index, 1);
					//salvar dados atuais das todos
					this.saveTodoInLocalStorage()
					return todos
				})
			}
		}
	}

}
