import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DocsComponent } from './docs/docs.component';
import { GameComponent } from './game/game.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'game', title: "Game", component: GameComponent },
  { path: 'docs', title: "Documentation", component: DocsComponent },
  { path: 'leaderboard', title: "Leaderboard", component: LeaderboardComponent },
  { path: "",  redirectTo: '/game', pathMatch: 'full' },
  { path: '**', title: "404", component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule {
  
 }
