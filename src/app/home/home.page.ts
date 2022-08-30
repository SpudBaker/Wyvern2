import { Component } from '@angular/core';
import { AuthService } from '../services/auth';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public login$: Observable<User>;
  public loginErrMessage: string;
  public inputEmail: string;
  public inputPassword: string;

  constructor(private authService: AuthService) {
    this.login$ = this.authService.getLoginStatus();
  }

  public signOut(){
    this.authService.signOut();
  }

  public submit(){
    this.loginErrMessage = null;
    if ((!this.inputEmail) || (!this.inputPassword)){
      this.loginErrMessage = 'Enter both email and password';
      return;
    }

  }

}
