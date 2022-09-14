import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import * as Globals from '../../globals';
import { GameService } from '../services/game';

@Component({
  selector: 'app-game',
  templateUrl: 'game.page.html',
  styleUrls: ['game.page.scss'],
})
export class GamePage {

  game: Globals.Game;
  gameSubscription: Subscription;

  constructor(private gameService: GameService, private router: Router) {
    this.gameSubscription = this.gameService.getCurrentGameObservable().subscribe(res => this.game = res);
  }

}
