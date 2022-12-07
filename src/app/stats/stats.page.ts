import { Component } from '@angular/core';
import { GameService } from '../services/game';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Globals from '../../globals';

@Component({
  selector: 'app-stats',
  templateUrl: 'stats.page.html',
  styleUrls: ['stats.page.scss'],
})
export class StatsPage {

  public usersArr$ : Observable<Globals.User[]>;

  constructor(public gameService: GameService) {
    this.usersArr$ = this.gameService.getUsers().pipe(
      map(users => {
        return users;
      })
    )
  }

}
