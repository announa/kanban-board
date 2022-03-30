import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/User.class';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  newUser = new User();

  constructor(private fireService: FirestoreService, private router: Router) { }

  ngOnInit(): void {
  }

  async register(){
    let id = await this.fireService.addUser(this.newUser)
    console.log(id)
    this.router.navigateByUrl('/' + id + '/boards')
  }
}
