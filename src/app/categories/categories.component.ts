import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ColorEvent } from 'ngx-color';
import { CategoriesEditComponent } from '../categories-edit/categories-edit.component';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  newCategory = { category: '', color: '#fff' };
  oldCategory: string = '';
  isEditingCategory = false;
  isEditingColor = false;
  currentColor!: any;
  currentColorItem!: number;
  @ViewChild(CategoriesEditComponent) editComponent!: CategoriesEditComponent;
  @Output() closeCatModal = new EventEmitter();

  constructor(public fireService: FirestoreService) {}

  ngOnInit(): void {}

  addCategory() {
    this.fireService.addNewCategory(this.newCategory);
    this.newCategory = { category: '', color: this.getRandomColor() };
  }

  getRandomColor() {
    return `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
      Math.random() * 255
    }, ${Math.random()})`;
  }

  editCategoryColor(index: number) {
    this.isEditingColor = true;
    this.currentColorItem = index;
  }

  setCurrentColor(event: ColorEvent) {
    this.currentColor = `rgba(${event.color.rgb.r}, ${event.color.rgb.g}, ${event.color.rgb.b}, ${event.color.rgb.a})`;
  }

  saveColor() {
    if (this.fireService.currentBoard) {
      this.fireService.updateCategories(
        {
          category:
            this.fireService.currentBoard.categories[this.currentColorItem]
              .category,
          color: this.currentColor,
        },
        this.currentColorItem
      );
      this.isEditingColor = false;
    }
  }

  closeCategoryModal() {
    this.closeCatModal.emit(true);
  }
}
