import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { TodoInterface, TodoState } from '../../../../store/todo.state';
import { Observable } from 'rxjs';
import { DeleteTodo, EditTodo } from '../../../../store/todo.actions';

@Component({
    selector: 'app-todo-list',
    templateUrl: './todo-list.component.html',
    styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
    @Select(TodoState.todos)
    todos$: Observable<TodoInterface[]>;

    constructor(private store: Store) {}

    ngOnInit(): void {}

    trackById(index: number, todo: TodoInterface): string {
        return todo.id;
    }

    toggle(todo: TodoInterface): void {
        this.store.dispatch(new EditTodo(todo.id, !todo.done));
    }

    delete(id: string): void {
        this.store.dispatch(new DeleteTodo(id));
    }
}
