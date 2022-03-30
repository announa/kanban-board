import { Component, OnInit } from '@angular/core';
import { User } from '../models/User.class';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  userInput = {
    username: '',
    password: ''
  }

  constructor() { }

  ngOnInit(): void {
  }

  logIn(){
    console.log('log in')
  }

}
