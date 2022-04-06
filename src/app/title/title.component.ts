import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { DragNdropService } from '../services/drag-ndrop.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss'],
})
export class TitleComponent implements OnInit, AfterViewInit {
  menuIsOpen = false;
  isEditingTitle = false;
  title!: string;
  left = false;

  @Input('hostObject') hostObject: any;
  @Input('collection') collection!: string;
  @Output() showCatModal = new EventEmitter();
  @Output() addTicket = new EventEmitter();
  @ViewChild('inputTitle') inputTitle!: ElementRef;
  @ViewChild('menu') menu!: ElementRef;
  @HostListener('document:click', ['$event'])
  clickListener(event: any) {
    this.resetVariables(event);
  }

  constructor(
    public fireService: FirestoreService,
    public dragService: DragNdropService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.title = this.hostObject.title;
  }

  ngAfterViewInit(): void {}

  toggleMenu(event?: any) {
    if (event) event.stopPropagation();
    this.checkOpeningPosition();
    this.menuIsOpen = !this.menuIsOpen;
  }

  checkOpeningPosition() {
    const elem = this.menu.nativeElement.getBoundingClientRect();
    if (elem.x + 200 > window.innerWidth) {
      this.left = true;
    }
  }

  edit(event: any) {
    event.stopPropagation();
    this.isEditingTitle = true;
    this.dragService.isEditingTitle = true;
    setTimeout(() => {
      this.inputTitle.nativeElement.focus();
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
      this.dragService.isEditingTitle = false;
      this.inputTitle.nativeElement.value = this.hostObject.title;
    }
  }

  resetOpenMenu(event: any) {
    if (this.menuIsOpen && !event.target.classList.contains('menu')) {
      this.menuIsOpen = false;
    }
  }

  checkKey(columnId: string, event: any) {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.saveTitle(event, columnId);
    }
  }

  saveTitle(event: any, id: string) {
    event.stopPropagation();
    const inputTitle = this.inputTitle.nativeElement.textContent;
    console.log(inputTitle);
    if (inputTitle != this.hostObject.title) {
      this.fireService.saveTitle(this.collection, id, inputTitle);
    }
    this.isEditingTitle = false;
    this.dragService.isEditingTitle = false;
  }

  delete(event: any, id: string) {
    event.stopPropagation();
    this.fireService.deleteDoc(this.collection, id);
    setTimeout(() => {
      this.toggleMenu();
    }, 10);
    this.redirect();
  }

  redirect() {
    if (this.router.url == '/board/' + this.fireService.currentBoardId)
      this.router.navigateByUrl('/boards');
  }

  addNewTicket() {
    this.addTicket.emit(true);
  }

  noDefault(event: any) {
    if (this.isEditingTitle) event.stopPropagation();
  }

  showCategoryModal() {
    this.showCatModal.emit(true);
  }
}
