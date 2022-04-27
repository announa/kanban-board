import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ColorEvent } from 'ngx-color';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  newCategory = {category: '', color: '#fff'};
  oldCategory: string = '';
  isEditingCategory = false;
  isEditingColor = false;
  currentColor!: any;
  currentColorItem!: number;
  @ViewChildren('categories') categories!: QueryList<ElementRef>;
  @Output() closeCatModal = new EventEmitter();

  constructor(public fireService: FirestoreService) {}

  ngOnInit(): void {}

  addCategory() {
    console.log('add category');
    this.fireService.addNewCategory(this.newCategory);
    this.newCategory = {category: '', color: '#fff'};
  }

  editCategoryTitle(index: number) {
    this.isEditingCategory = true;
    if(this.fireService.currentBoard)
    this.oldCategory = this.fireService.currentBoard.categories[index].category;
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
    if (
      editedCategory !=
        this.fireService.currentBoard?.categories[index].category &&
      this.fireService.currentBoard
    ) {
      this.fireService.updateCategories(
        {
          category: editedCategory,
          color: this.fireService.currentBoard.categories[index].color,
        },
        index
      );
      /* this.fireService.updateCategoriesInTickets() */
    }
    this.isEditingCategory = false;
  }

  editCategoryColor(index: number) {
    this.isEditingColor = true;
    this.currentColorItem = index;
  }

  setCurrentColor(event: ColorEvent) {
    console.log(event.color.rgb);
    this.currentColor = `rgba(${event.color.rgb.r}, ${event.color.rgb.g}, ${event.color.rgb.b}, ${event.color.rgb.a})`;
    console.log(this.currentColor);
    
  }

  saveColor() {
    if (this.fireService.currentBoard)
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

  deleteCategory(index: number) {
    this.fireService.deleteCategory(index);
  }

  closeCategoryModal() {
    this.closeCatModal.emit(true);
  }

  resetInput(event: any){
    console.log(event)
  }
}
