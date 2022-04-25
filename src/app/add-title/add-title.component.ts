import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-add-title',
  templateUrl: './add-title.component.html',
  styleUrls: ['./add-title.component.scss']
})
export class AddTitleComponent implements OnInit {
  @Input('newObject') newObject: any;
  @Output() onCloseModal = new EventEmitter();
  newTitle: string = ''

  constructor(private fireService: FirestoreService) { }

  ngOnInit(): void {
  }

  saveTitle(){
    this.fireService.addBoard(this.newTitle);
    this.closeModal();
  }
  
  closeModal(){
    this.onCloseModal.emit(true)
    this.newTitle = '';
  }
}
