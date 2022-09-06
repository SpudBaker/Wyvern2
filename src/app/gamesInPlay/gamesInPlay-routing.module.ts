import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamesInPlayPage } from './gamesInPlay.page';

const routes: Routes = [
  {
    path: '',
    component: GamesInPlayPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewGamePageRoutingModule {}
