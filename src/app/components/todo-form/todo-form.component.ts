import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { TodoSignalService } from '../../services/todo-signal.service';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatDialogModule],
  templateUrl: './todo-form.component.html',
})
export class TodoFormComponent {

	//Dialog: referência do modal que abriu esse componente
	private dialogRefService = inject(MatDialogRef<HeaderComponent>)

	//Injeção de dependência
	private todoSignalService = inject(TodoSignalService);

	//Receber todos os todos
	public AllTodos = this.todoSignalService.todoState();

	//formulario
	public todoForm = new FormGroup({
		title: new FormControl('', [Validators.required, Validators.minLength(3)]),
		description: new FormControl('', [Validators.required, Validators.minLength(5)])
	})

	handleCreateNewTodo():void {
		if (this.todoForm.value && this.todoForm.valid) {
			const title = String(this.todoForm.controls['title'].value);
			const description = String(this.todoForm.controls['description'].value);
			const id = this.AllTodos.length > 0 ? this.AllTodos.length + 1 : 1;
			const done = false;

			this.todoSignalService.updateTodo({id,title,description,done});
			this.dialogRefService.close();
		}
	}

	handleCloseModal():void {
		this.dialogRefService.close();
	}

}
