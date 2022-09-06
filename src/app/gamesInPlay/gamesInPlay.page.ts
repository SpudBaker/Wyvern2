import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentData } from 'firebase/firestore';
import * as Globals from '../../globals';
import { GameService } from '../services/game';

@Component({
  selector: 'app-gamesInPlay',
  templateUrl: 'gamesInPlay.page.html',
  styleUrls: ['gamesInPlay.page.scss'],
})
export class GamesInPlayPage {

  public games: DocumentData[];

  constructor(private gameService: GameService, private router: Router) {
    this.gameService.hasIncompleteGame()
    .then(games => {
      this.games = games;
    });
  }

}
