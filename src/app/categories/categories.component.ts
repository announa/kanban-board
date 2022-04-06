import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  newCategory = '';
  showTooltip1 = false;
  showTooltip2 = false;
  isEditingCategory = false;
  @ViewChildren('categories') categories!: QueryList<ElementRef>;

  constructor(public fireService: FirestoreService) {}

  ngOnInit(): void {}

  addCategory() {
    console.log('add category');
    this.fireService.addNewCategory(this.newCategory);
    this.newCategory = '';
  }

  toggleTooltip(number: number) {
    if (number === 1) this.showTooltip1 = !this.showTooltip1;
    else this.showTooltip2 = !this.showTooltip2;
  }

  editCategory(index: number) {
    this.isEditingCategory = true;
    setTimeout(() => {
      this.categories.toArray()[index].nativeElement.focus();
    }, 50);
  }

  checkKey(index: number, event: any) {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.saveCategory(index);
    }
  }

  saveCategory(index: number) {
    const editedCategory =
      this.categories.toArray()[index].nativeElement.textContent;
    if (editedCategory != this.fireService.currentBoard.categories[index]) {
      this.fireService.updateCategories(editedCategory, index);
    }
    this.isEditingCategory = false;
  }

  deleteCategory(index: number) {
    this.fireService.deleteCategory(index);
  }
}
