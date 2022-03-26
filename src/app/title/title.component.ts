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
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss'],
})
export class TitleComponent implements OnInit {
  menuIsOpen = false;
  isEditingTitle = false;
  title!: string;

  @Input('data') data: any;
  @Input('collection') collection!: string;
  @ViewChild('input') input!: ElementRef;
  @HostListener('document:click', ['$event'])
  clickListener(event: any) {
    this.resetVariables(event);
  }

  constructor(
    public fireService: FirestoreService,
    public dragService: DragNdropService
  ) {}

  ngOnInit(): void {
    this.title = this.data.title;
  }

  toggleMenu(event?: any) {
    if (event) event.stopPropagation();
    this.menuIsOpen = !this.menuIsOpen;
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
    this.resetEditTitle(event);
    this.resetOpenMenu(event);
  }

  resetEditTitle(event: any) {
    if (
      !event.target.classList.contains('edit-title-input') &&
      !event.target.classList.contains('menu-container')
    ) {
      this.isEditingTitle = false;
      this.input.nativeElement.value = this.data.title;
    }
  }

  resetOpenMenu(event: any) {
    if (this.menuIsOpen && !event.target.classList.contains('menu')) {
      this.menuIsOpen = false;
    }
  }

  checkKey(columnId: string, event: any) {
    if (event.keyCode === 13) {
      this.saveTitle(event, columnId);
    }
  }

  saveTitle(event: any, id: string) {
    event.stopPropagation();
    if (this.title != this.data.title) {
      this.fireService.saveTitle(this.collection, id, this.title);
    }
    this.isEditingTitle = false;
  }

  delete(event: any, id: string) {
    event.stopPropagation();
    this.fireService.deleteDoc(this.collection, id);
    setTimeout(() => {
      this.toggleMenu();
    }, 10);
  }
}
