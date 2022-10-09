import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../services/game';
import { AuthService } from '../services/auth';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Globals from '../../globals';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public incompleteGames = new Array<Globals.Game>;
  public login$: Observable<User>;
  public loginErrMessage: string;
  public inputEmail: string;
  public inputPassword: string;

  constructor(private authService: AuthService, private gameService: GameService, private router: Router) {
    this.login$ = this.authService.getLoginStatus().pipe(
      map(data => {
        this.populateIncompleteGames();
        return data;
      })
    );
  }

  private populateIncompleteGames(){
    this.gameService.getIncompleteGames().then(data => {
      this.incompleteGames = data;
    });
  }

  public newGameButtonPress(){
    this.router.navigate(['newGame']);
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
  
  public viewGamesButtonPress(){
    this.router.navigate(['gamesInPlay']);
  }

  public stats(){
    this.router.navigate(['stats']);
  }

}
