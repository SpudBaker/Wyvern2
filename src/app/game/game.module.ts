import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { GamePage } from './game.page';

import { NewGamePageRoutingModule } from './game-routing.module';
import { GameStartModalComponent } from './modalComponents/gameStart/gameStartModal.component';
import { GameFinishModalComponent } from './modalComponents/gameFinish/gameFinishModal.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewGamePageRoutingModule
  ],
  declarations: [GamePage, GameFinishModalComponent, GameStartModalComponent]
})
export class GamePageModule {}
