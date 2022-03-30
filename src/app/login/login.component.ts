import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { User } from '../models/User.class';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  userInput = {
    username: '',
    password: '',
  };

  constructor(private fireService: FirestoreService, private router: Router) {}

  ngOnInit(): void {}

  async logIn() {
    console.log('logging in ...');
    this.fireService.checkUsers(
      this.userInput.username,
      this.userInput.password
    );
    const result = await firstValueFrom(
      this.fireService.checkUsers(
        this.userInput.username,
        this.userInput.password
      )
    );

    this.fireService.matchingUser = result[0] as User;

    if (this.fireService.matchingUser) {
      console.log(this.fireService.matchingUser);
      this.fireService.setCurrentUser();
      this.loadUserBoards();
    }
  }

  loadUserBoards() {
    this.router.navigateByUrl(
      '/' + this.fireService.currentUser.id + '/boards'
    );
  }
}
