import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { GamePage } from './game.page';

import { NewGamePageRoutingModule } from './game-routing.module';
import { ModalComponent } from './modalComponent/modal.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewGamePageRoutingModule
  ],
  declarations: [GamePage, ModalComponent]
})
export class GamePageModule {}
