import {Action, NgxsOnInit, Selector, State, StateContext, Store} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {AddTodo, DeleteTodo, EditTodo, SetTodos} from './todo.actions';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import {AuthState} from './auth.state';
import {from, Observable, of} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';

export interface TodoInterface {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  done: boolean;
}

export interface TodoStateModel {
  todos: TodoInterface[];
}

function getDefaultState(): TodoStateModel {
  return {
    todos: [],
  };
}

@State<TodoStateModel>({
  name: 'todoState',
  defaults: getDefaultState(),
})
@Injectable()
export class TodoState implements NgxsOnInit {
  @Selector()
  static todos(state: TodoStateModel): TodoInterface[] {
    return state.todos;
  }

  constructor(private angularFirestore: AngularFirestore, private store: Store) {
  }

  ngxsOnInit(context?: StateContext<any>): void {
    this.store.select(AuthState.userId)
      .pipe(
        switchMap(userId => {
          if (userId === null) {
            return of(null);
          } else {
            return this.angularFirestore
              .collection('todos')
              .doc(userId)
              .collection<TodoInterface>('items')
              .valueChanges({
                idField: 'id'
              })
              .pipe(
                tap(todos => {
                  context.dispatch(new SetTodos(todos));
                })
              );
          }
        }),
      )
      .subscribe();
  }

  @Action(AddTodo)
  addTodo(context: StateContext<TodoStateModel>, action: AddTodo): Observable<any> {
    const userId = this.store.selectSnapshot(AuthState.userId);
    const now = new Date();

    return from(
      this.getCollection(userId)
        .add({
          title: action.title,
          done: false,
          createdAt: now,
          updatedAt: now,
        })
    );
  }

  @Action(EditTodo)
  editTodo(context: StateContext<TodoStateModel>, action: EditTodo): Observable<any> {
    const userId = this.store.selectSnapshot(AuthState.userId);
    const now = new Date();

    return from(
      this.getCollection(userId).doc(action.id).set({
        done: action.done,
        updatedAt: now,
      }, {merge: true})
    );
  }

  @Action(DeleteTodo)
  deleteTodo(context: StateContext<TodoStateModel>, action: DeleteTodo): Observable<any> {
    const userId = this.store.selectSnapshot(AuthState.userId);
    return from(this.getCollection(userId).doc(action.id).delete());
  }

  @Action(SetTodos)
  setTodos(context: StateContext<TodoStateModel>, action: SetTodos): void {
    context.patchState({
      todos: action.todos,
    });
  }

  private getCollection(userId: string): AngularFirestoreCollection<Partial<TodoInterface>> {
    return this.angularFirestore
      .collection('todos')
      .doc(userId)
      .collection<Partial<TodoInterface>>('items');
  }
}
