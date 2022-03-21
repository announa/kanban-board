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
  isEditingTitle = false;
  title!: string;
  titles!: string[];
  /*   newTitles!: string[]; */

  @Input('column') column: any;
  @ViewChild('input') input!: ElementRef;
  @HostListener('document:click', ['$event'])
  clickListener(event: any) {
    this.resetEditTitle(event);
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

  edit(event: any) {
    event.stopPropagation();
    this.isEditingTitle = true;
    console.log(this.input.nativeElement);
    setTimeout(() => {
      this.input.nativeElement.focus();
    }, 50);
  }

  resetEditTitle(event: any) {
    if (
      event.target.id != 'edit-title-input' &&
      !event.target.classList.contains('edit-container')
    ) {
      this.isEditingTitle = false;
      /* this.input.nativeElement.value = this.column.title; */
    }
  }

  saveTitle(columnId: string) {
    if (this.title != this.column.title) {
      this.fireService.saveColumnTitle(columnId, this.title);
    }
    this.isEditingTitle = false;
  }
}
