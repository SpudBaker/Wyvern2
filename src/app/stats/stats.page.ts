import { Component } from '@angular/core';
import { GameService } from '../services/game';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-stats',
  templateUrl: 'stats.page.html',
  styleUrls: ['stats.page.scss'],
})
export class StatsPage {

  public usersArr$ : Observable<string[]>;

  constructor(public gameService: GameService) {
    this.usersArr$ = this.gameService.getUsers().pipe(
      map(users => {
        return users;
      })
    )
  }

}
