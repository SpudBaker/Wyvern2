import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentData } from 'firebase/firestore';
import * as Globals from '../../globals';
import { GameService } from '../services/game';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-game',
  templateUrl: 'game.page.html',
  styleUrls: ['game.page.scss'],
})
export class GamePage {

  constructor(private authService: AuthService, private gameService: GameService, private router: Router) {
  }

}
