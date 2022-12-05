import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as Globals from '../../../../globals';


@Component({
  selector: 'game-start-modal',
  templateUrl: 'gameStartModal.component.html',
  styleUrls: ['gameStartModal.component.scss'],
})
export class GameStartModalComponent {

  public opponent: Globals.User;

  constructor(private modalController: ModalController) {}

  public close(){
    this.modalController.dismiss();
  }

  public getOpponentEmail(): string {
    return this.opponent.email;
  }

  public getOpponentScore(): number {
    return this.opponent.score;
  }


}