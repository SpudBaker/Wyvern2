import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentData } from 'firebase/firestore';
import * as Globals from '../../globals';
import { GameService } from '../services/game';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-gamesInPlay',
  templateUrl: 'gamesInPlay.page.html',
  styleUrls: ['gamesInPlay.page.scss'],
})
export class GamesInPlayPage {

  public games: DocumentData[];

  constructor(private authService: AuthService, private gameService: GameService, private router: Router) {
    this.gameService.hasIncompleteGame()
    .then(games => {
      this.games = games;
    });
  }

  public getOpposingPlayer(doc: DocumentData): string{ 
    if((doc.data().player1 as string).toLocaleLowerCase() == this.authService.getUserEmail().toLocaleLowerCase()){
      if(doc.data().player2){
        return (doc.data().player2 as string).toLocaleLowerCase()
      } else {
        return 'unmatched';
      }
    } else {
      return (doc.data().player1 as string).toLocaleLowerCase();
    }
  }
}
