import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-categories-edit',
  templateUrl: './categories-edit.component.html',
  styleUrls: ['./categories-edit.component.scss']
})
export class CategoriesEditComponent implements OnInit {

  showTooltip1 = false;
  showTooltip2 = false;
  isEditingCategory = false;
  @Input('index') index!: number;
  @Input('categories') categories!: any;
  @Output() saveCat = new EventEmitter();
  @Output() editCat = new EventEmitter();
  @Output() deleteCat = new EventEmitter();

  constructor(private fireService: FirestoreService) { }

  ngOnInit(): void {
  }

  toggleTooltip(number: number) {
    if (number === 1) this.showTooltip1 = !this.showTooltip1;
    else this.showTooltip2 = !this.showTooltip2;
  }

  editCategory() {
    this.isEditingCategory = true;
    this.editCat.emit(true)
  }
  
  saveCategory() {
    this.saveCat.emit(true)
    this.isEditingCategory = false;
  }


  deleteCategory() {
    this.deleteCat.emit(true)
  }
}
