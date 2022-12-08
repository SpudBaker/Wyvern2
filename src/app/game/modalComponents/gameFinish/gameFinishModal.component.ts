import { Component } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { forkJoin, from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth';
import * as Globals from '../../../../globals';


@Component({
  selector: 'game-finish-modal',
  templateUrl: 'gameFinishModal.component.html',
  styleUrls: ['gameFinishModal.component.scss'],
})
export class GameFinishModalComponent {

  readonly minWin = 10;
  private game: Globals.Game;
  public loser: Globals.User;
  public loserChange = -10;
  public pageInitiated = false;
  public winner: Globals.User;
  public winnerChange = 10;

  constructor(private authService: AuthService, private LoadingController: LoadingController , private modalController: ModalController) {
  }

  calculateScoresAndUpdateUsers(): Observable<any>{
    if((this.winner.score - this.loser.score) >= 0){
      this.winnerChange = Math.floor(0.05 * this.loser.score);
      this.loserChange = 0 - this.winnerChange;
      if (this.winnerChange < this.minWin){
        this.winnerChange = this.minWin;
      }
    }
    if((this.winner.score - this.loser.score) < 0){
      this.winnerChange = Math.floor(0.05 * this.loser.score);
      this.loserChange = 0 - this.winnerChange;
      if (this.winnerChange < (0.3 * this.winner.score)){
        this.winnerChange = Math.floor(0.3 * this.winner.score);
      }
    }
    const winnerGames: string[] = [...this.winner.games]
    winnerGames.push(this.game.id);
    const loserGames: string[] = [...this.loser.games]
    loserGames.push(this.game.id);
    return forkJoin({
      winner: this.authService.updateUserScore(this.winner, this.winnerChange, winnerGames),
      loser: this.authService.updateUserScore(this.loser, this.loserChange, loserGames)
    })
  }

  public close(){
    this.modalController.dismiss();
  }

  public getLoser(): string {
    if((this.game.player1Board.target.horizontal == this.game.player1Board.marker.horizontal) &&
          (this.game.player1Board.target.vertical == this.game.player1Board.marker.vertical)){
        return this.game.player1;
      } else {
        return this.game.player2;
      }
  }

  public getWinner(): string {
    if((this.game.player1Board.target.horizontal == this.game.player1Board.marker.horizontal) &&
        (this.game.player1Board.target.vertical == this.game.player1Board.marker.vertical)){
        return this.game.player2;
    } else {
        return this.game.player1;
    }
  }

  ngOnInit(){
    from(this.LoadingController.create()).pipe(
      switchMap(a => a.present()),
      switchMap(() => {
        return forkJoin(
          {
            loser: this.authService.getUserDatabaseRecordByID(this.getLoser()), 
            winner: this.authService.getUserDatabaseRecordByID(this.getWinner())
          }
        )
      }),
      switchMap(val => {
        this.loser = val.loser;
        this.winner = val.winner;
        return this.calculateScoresAndUpdateUsers()
      }),
      switchMap(() => {
        this.pageInitiated = true;
        return this.LoadingController.dismiss();
      })
    ).subscribe();
  }

}