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
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreDocument, AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { ColumnTitleComponent } from './column-title/column-title.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    BoardColumnComponent,
    NavigationComponent,
    TicketComponent,
    TicketAddComponent,
    ColumnTitleComponent,
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
  bootstrap: [AppComponent]
})
export class AppModule { }
