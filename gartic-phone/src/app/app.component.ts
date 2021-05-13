import { Component } from '@angular/core';
import {Select} from '@ngxs/store';
import {AuthState} from './store/auth.state';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @Select(AuthState.userId) userId$: Observable<string>;
}
