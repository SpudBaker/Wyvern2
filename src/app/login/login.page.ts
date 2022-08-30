import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '@angular/fire/auth';
import { AuthService } from '../services/auth';
import { catchError, first, map } from 'rxjs/operators';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  public login$: Observable<User>;
  public loginErrMessage: string;
  public inputEmail: string;
  public inputPassword: string;

  constructor(private authService: AuthService) {}

  private register(){
    this.loginErrMessage = null;
    this.authService.createUserWithEmailAndPassword(this.inputEmail, this.inputPassword)
    .pipe(
      first(),
      catchError(err => {
        console.log('register error');
        switch (err.code){
          case ('auth/invalid-email'):
            this.loginErrMessage = 'Enter the correct email format';
            break;
          case ('auth/email-already-in-use'):
            this.loginErrMessage = 'Email address is alreday registered';
            break;
          case ('auth/weak-password'):
            this.loginErrMessage = 'Create a stronger password when registering';
            break;
          default:
            this.loginErrMessage = err.code;
        };
        return of(void 0);
      })
    ).subscribe();
  }

  public resetPassword(){
    console.log('login page - password reset');
    this.loginErrMessage = null;
    if (!this.inputEmail){
      this.loginErrMessage = 'Enter an email to reset your password';
      return;
    }
    this.authService.resetPassword(this.inputEmail)
    .pipe(
      first(),
      map(() => this.loginErrMessage = 'Check your inbox for an email with a password reset link'),
      catchError(err => {
        switch (err.code){
          case ('auth/invalid-email'):
            this.loginErrMessage = 'Enter the correct email format';
          default:
            this.loginErrMessage = err.code;
        };
        return of(void 0);
      })
    ).subscribe();
  }

  public signIn(){
    this.loginErrMessage = null;
    if ((!this.inputEmail) || (!this.inputPassword)){
      this.loginErrMessage = 'Enter both email and password';
      return;
    }
    this.authService.signIn(this.inputEmail, this.inputPassword)
    .pipe(
      first(),
      catchError(err => {
        switch (err.code){
          case ('auth/invalid-email'):
            this.loginErrMessage = 'Enter the correct email format';
            break;
          case('auth/user-not-found'):
            this.register();
            break;
          case ('auth/wrong-password'):
            this.loginErrMessage = 'Wrong password - try again or reset';
            break;
          case ('auth/too-many-requests'):
            this.loginErrMessage = 'Too many attempts and account is locked. Reset password.';
            break;
          default:
            this.loginErrMessage = err.code;
        }
        return of(void 0);
      })
    ).subscribe();
  }

}
