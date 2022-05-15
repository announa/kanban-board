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
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import {
  AngularFirestoreModule,
} from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { TitleComponent } from './title/title.component';
import { BoardsOverviewComponent } from './boards-overview/boards-overview.component';
import { BoardsPreviewComponent } from './boards-preview/boards-preview.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LoadingBarComponent } from './loading-bar/loading-bar.component';
import { BacklogComponent } from './backlog/backlog.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoriesEditComponent } from './categories-edit/categories-edit.component';
import { SetBgComponent } from './set-bg/set-bg.component';
import { HttpClientModule } from '@angular/common/http';
import { AddTitleComponent } from './add-title/add-title.component';
import { ColorSketchModule } from 'ngx-color/sketch';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { HomeComponent } from './home/home.component';
import { LoadingCircleComponent } from './loading-circle/loading-circle.component';
import { PrivacyComponent } from './privacy/privacy.component';

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
    LoginComponent,
    RegisterComponent,
    LoadingBarComponent,
    BacklogComponent,
    TooltipComponent,
    CategoriesComponent,
    CategoriesEditComponent,
    SetBgComponent,
    AddTitleComponent,
    PasswordResetComponent,
    VerifyEmailComponent,
    HomeComponent,
    LoadingCircleComponent,
    PrivacyComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    HttpClientModule,
    ColorSketchModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
