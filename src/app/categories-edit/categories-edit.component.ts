import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-categories-edit',
  templateUrl: './categories-edit.component.html',
  styleUrls: ['./categories-edit.component.scss'],
})
export class CategoriesEditComponent implements OnInit {
  showTooltipEdit = false;
  showTooltipColor = false;
  showTooltipDelete = false;
  isEditingCategory = false;
  oldCategory = '';
  @ViewChild('categoryElem') categoryElem!: ElementRef;
  @ViewChildren('save') save!: QueryList<ElementRef>;
  @Input('category') category!: { category: string; color: string };
  @Input('index') index!: number;
  @Output() editCatColor = new EventEmitter();

  constructor(public fireService: FirestoreService) {}

  ngOnInit(): void {}

  editCategoryTitle() {
    this.isEditingCategory = true;
    if (this.fireService.currentBoard)
      this.oldCategory =
        this.fireService.currentBoard.categories[this.index].category;
    setTimeout(() => {
      this.categoryElem.nativeElement.focus();
    }, 50);
  }

  checkKey(event: any) {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.saveCategory();
    }
  }

  editCategoryColor() {
    this.editCatColor.emit(this.index);
  }

  saveCategory() {
    const editedCategory = this.categoryElem.nativeElement.textContent;
    if (
      editedCategory &&
      editedCategory !=
        this.fireService.currentBoard?.categories[this.index].category &&
      this.fireService.currentBoard
    ) {
      this.fireService.updateCategories(
        {
          category: editedCategory,
          color: this.fireService.currentBoard.categories[this.index].color,
        },
        this.index
      );
    }
    this.isEditingCategory = false;
  }

  deleteCategory() {
    this.fireService.deleteCategory(this.index);
  }

  onBlur(event: any) {
    if (!this.saveWasClicked(event)) {
      this.isEditingCategory = false;
      this.categoryElem.nativeElement.textContent = this.oldCategory;
    }
  }

  saveWasClicked(event: any) {
    const isClicked = this.save.find(
      (elem) => elem.nativeElement == event.target
    );
    return isClicked ? true : false;
  }
}
