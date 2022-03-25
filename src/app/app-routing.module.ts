import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardComponent } from './board/board.component';
import { BoardsOverviewComponent } from './boards-overview/boards-overview.component';

const routes: Routes = [
  {path: '', component: BoardsOverviewComponent},
  {path: 'board/:id', component: BoardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
