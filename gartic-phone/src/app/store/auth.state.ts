import {Action, NgxsOnInit, Selector, State, StateContext} from '@ngxs/store';
import firebase from 'firebase';
import User = firebase.User;
import {UserChanged} from './auth.actions';
import {AngularFireAuth} from '@angular/fire/auth';
import {Injectable} from '@angular/core';

export interface AuthStateModel {
  user: User;
}

@State<AuthStateModel>({
  name: 'authState',
  defaults: {
    user: null,
  },
})
@Injectable()
export class AuthState implements NgxsOnInit {
  constructor(private authService: AngularFireAuth) {
  }

  @Selector()
  static userId(state: AuthStateModel): string | null {
    return state.user?.uid || null;
  }

  ngxsOnInit(context?: StateContext<AuthStateModel>): any {
    this.authService.authState.subscribe(user => {
      context.dispatch(new UserChanged(user));
    });
  }

  @Action(UserChanged)
  userChanged(context: StateContext<AuthStateModel>, action: UserChanged): void {
    context.patchState({
      user: action.user,
    });
  }
}
