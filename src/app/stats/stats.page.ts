import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../services/game';
import { AuthService } from '../services/auth';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Globals from '../../globals';

@Component({
  selector: 'app-stats',
  templateUrl: 'stats.page.html',
  styleUrls: ['stats.page.scss'],
})
export class StatsPage {

  public usersArr$ : Observable<string[]>;

  constructor(private authService: AuthService, private gameService: GameService, private router: Router) {
    this.usersArr$ = this.gameService.getUsers().pipe(
      map(users => {
        return users;
      })
    )
  }

}
