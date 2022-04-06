import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { BoardColumnComponent } from './board-column/board-column.component';
import { NavigationComponent } from './navigation/navigation.component';
import { TicketComponent } from './ticket/ticket.component';
import { TicketAddComponent } from './ticket-add/ticket-add.component';
import { FormsModule } from '@angular/forms';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import {
  AngularFirestoreDocument,
  AngularFirestoreModule,
} from '@angular/fire/compat/firestore';
import { TitleComponent } from './title/title.component';
import { BoardsOverviewComponent } from './boards-overview/boards-overview.component';
import { BoardsPreviewComponent } from './boards-preview/boards-preview.component';
import { EditMenuComponent } from './edit-menu/edit-menu.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LoadingBarComponent } from './loading-bar/loading-bar.component';
import { BacklogComponent } from './backlog/backlog.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoriesEditComponent } from './categories-edit/categories-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    BoardColumnComponent,
    NavigationComponent,
    TicketComponent,
    TicketAddComponent,
    TitleComponent,
    BoardsOverviewComponent,
    BoardsPreviewComponent,
    EditMenuComponent,
    LoginComponent,
    RegisterComponent,
    LoadingBarComponent,
    BacklogComponent,
    TooltipComponent,
    CategoriesComponent,
    CategoriesEditComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    /* AngularFirestoreDocument */
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
