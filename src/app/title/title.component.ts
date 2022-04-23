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
  showMoveColumnMenu = false;
  title!: string;
  left = false;
  top = false;

  @Input('hostObject') hostObject: any;
  @Input('index') index?: number;
  @Input('collection') collection!: string;
  @Output() showCatModal = new EventEmitter();
  @Output() addTicket = new EventEmitter();
  @Output() setBackground = new EventEmitter();
  @Output() boardOverviewEvent = new EventEmitter();
  @Output() moveColumnEvent = new EventEmitter();
  @ViewChild('titleInput') titleInput!: ElementRef;
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
    this.emitBoardOverviewEvent();
  }

  emitBoardOverviewEvent() {
    this.boardOverviewEvent.emit(this.menuIsOpen);
  }

  checkOpeningPosition() {
    const elem = this.menu.nativeElement.getBoundingClientRect();
    if (elem.x + 200 > window.innerWidth) {
      this.left = true;
    } else {
      this.left = false;
    }
    if (elem.y + 200 > window.innerHeight) {
      this.top = true;
    } else {
      this.top = false;
    }
  }

  edit(event: any) {
    event.stopPropagation();
    this.isEditingTitle = true;
    this.dragService.isEditingTitle = true;
    setTimeout(() => {
      this.titleInput.nativeElement.focus();
    }, 50);
  }

  resetVariables(event: any) {
    this.resetEditTitle(event);
    this.resetOpenMenu(event);
    this.toggleMoveColumnMenu(event);
  }

  resetEditTitle(event: any) {
/*     if (
      !event.target.classList.contains('edit-title-input') &&
      event.target.id !='save-title'
    ) { */
      this.isEditingTitle = false;
      this.dragService.isEditingTitle = false;
      this.titleInput.nativeElement.textContent = this.hostObject.title;
    /* } */
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
    const titleInput = this.titleInput.nativeElement.textContent;
    if (titleInput != this.hostObject.title) {
      this.fireService.updateDoc(this.collection, id, { title: titleInput });
    }
    this.isEditingTitle = false;
    this.dragService.isEditingTitle = false;
  }

  delete(event: any, id: string) {
    event.stopPropagation();
    this.fireService.deleteFromDb(this.collection, id);
    setTimeout(() => {
      this.toggleMenu();
    }, 10);
    if (this.collection == 'boards') this.redirect();
  }

  redirect() {
    if (this.router.url == '/board/' + this.fireService.currentBoard?.id)
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

  setBackgroundImage() {
    this.setBackground.emit(true);
  }

  toggleMoveColumnMenu(event: any) {
    event.stopPropagation();
    if (event.target.id != 'current-column') {
      if (!event.target.id.includes('move-column')) {
        this.showMoveColumnMenu = false;
      } else {
        this.showMoveColumnMenu = !this.showMoveColumnMenu;
      }
    }
  }

  moveColumn(index: number) {
    if (index != this.index)
      this.moveColumnEvent.emit({ col1: this.index, col2: index });
  }
}
