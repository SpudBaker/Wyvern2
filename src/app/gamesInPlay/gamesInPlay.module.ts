import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { GamesInPlayPage } from './gamesInPlay.page';

import { NewGamePageRoutingModule } from './gamesInPlay-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewGamePageRoutingModule
  ],
  declarations: [GamesInPlayPage]
})
export class GamesInPlayPageModule {}
