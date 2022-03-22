import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DragNdropService } from '../services/drag-ndrop.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-column-title',
  templateUrl: './column-title.component.html',
  styleUrls: ['./column-title.component.scss'],
})
export class ColumnTitleComponent implements OnInit {
  menuIsOpen = false;
  isEditingTitle = false;
  title!: string;
  titles!: string[];
  /*   newTitles!: string[]; */

  @Input('column') column: any;
  @ViewChild('input') input!: ElementRef;
  @HostListener('document:click', ['$event'])
  clickListener(event: any) {
    this.resetVariables(event);
  }

  constructor(
    public fireService: FirestoreService,
    public dragService: DragNdropService
  ) {
    /*     this.newTitles = this.titles; */
  }

  ngOnInit(): void {
    this.title = this.column.title;
    this.titles = this.fireService.columnTitles;
  }

  openMenu(event: any) {
    if (!this.menuIsOpen) {
      event.stopPropagation();
      this.menuIsOpen = true;
    }
  }

  edit(event: any) {
    event.stopPropagation();
    this.isEditingTitle = true;
    this.menuIsOpen = false;
    setTimeout(() => {
      this.input.nativeElement.focus();
    }, 50);
  }

  resetVariables(event: any) {
    console.log('click')
    this.resetEditTitle(event);
    this.resetOpenMenu(event);
  }

  resetEditTitle(event: any) {
    if (
      !event.target.classList.contains('edit-title-input') &&
      !event.target.classList.contains('menu-container')
    ) {
      this.isEditingTitle = false;
      this.input.nativeElement.value = this.column.title;
    }
  }

  resetOpenMenu(event: any) {
    if (this.menuIsOpen && !event.target.classList.contains('menu')) {
      console.log('xxxxxxxxxxxxxx');
      this.menuIsOpen = false;
    }
  }

  checkKey(columnId: string, event: any) {
    if (event.keyCode === 13) {
      this.saveTitle(columnId);
    }
  }

  saveTitle(columnId: string) {
    if (this.title != this.column.title) {
      this.fireService.saveColumnTitle(columnId, this.title);
    }
    this.isEditingTitle = false;
  }
}
