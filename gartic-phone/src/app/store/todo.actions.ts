import { TodoInterface } from './todo.state';

export class AddTodo {
    static readonly type = '[Todo] AddTodo';

    constructor(public title: string) {}
}

export class EditTodo {
    static readonly type = '[Todo] EditTodo';

    constructor(public id: string, public done: boolean) {}
}

export class DeleteTodo {
    static readonly type = '[Todo] DeleteTodo';

    constructor(public id: string) {}
}

export class SetTodos {
    static readonly type = '[Todo] SetTodos';

    constructor(public todos: TodoInterface[]) {}
}
