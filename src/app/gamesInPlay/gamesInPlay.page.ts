import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as Globals from '../../globals';
import { GameService } from '../services/game';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-gamesInPlay',
  templateUrl: 'gamesInPlay.page.html',
  styleUrls: ['gamesInPlay.page.scss'],
})
export class GamesInPlayPage {

  public games: Globals.Game[];

  constructor(private authService: AuthService, private gameService: GameService, private router: Router) {
    this.gameService.getIncompleteGames()
    .then(games => {
      this.games = games;
    });
  }

  public getOpposingPlayer(game: Globals.Game): string{ 
    if((game.player1 as string).toLocaleLowerCase() == this.authService.getUserEmail().toLocaleLowerCase()){
      if(game.player2){
        return (game.player2 as string).toLocaleLowerCase();
      } else {
        return 'unmatched';
      }
    } else {
      return (game.player1 as string).toLocaleLowerCase();
    }
  }

  public gameButtonPress(game: Globals.Game){
    this.gameService.gameInPlay = game;
    this.router.navigate(['game']);
  } 

}
