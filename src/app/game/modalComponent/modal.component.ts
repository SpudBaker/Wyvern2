import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as Globals from '../../../globals';


@Component({
  selector: 'app-modal',
  templateUrl: 'modal.component.html',
  styleUrls: ['modal.component.scss'],
})
export class ModalComponent {

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