import { ConstantPool } from '@angular/compiler';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from './services/firestore.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kanban-board';

  constructor(public fireService: FirestoreService, public router:Router){}
  async ngOnInit(): Promise<void> {
    this.fireService.isProcessing = true;
    await this.fireService.checkForOldGuestData();
    this.fireService.isProcessing = false;
  }

  showNav(){
    return this.router.url != '/' && this.router.url != '/register' && this.router.url != '/login' && this.router.url != '/imprint'
  }
}
