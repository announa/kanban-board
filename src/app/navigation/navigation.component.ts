import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  constructor(public fireService: FirestoreService, private router: Router) { }

  ngOnInit(): void {
  }

  logout(){
    console.log('log out')
    this.fireService.clearData()
    this.fireService.removeUserIdFromLocalStorage();
    this.goToLogin()
  }

  goToLogin(){
    this.router.navigateByUrl('/')
  }
}
