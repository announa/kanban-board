import {
  AfterViewChecked,
  ChangeDetectorRef,
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
export class TitleComponent implements OnInit, AfterViewChecked {
  menuIsOpen = false;
  isEditingTitle = false;
  showMoveColumnMenu = false;
  title!: string;
  left = false;
  top = false;
  spanWidth: number = 0;
  bigger700 = false;
  showTooltipEdit = false;
  showTooltipAdd = false;
  showTooltipBgImg = false;
  showTooltipCat = false;
  showTooltipDelete = false;

  @Input('hostObject') hostObject: any;
  @Input('index') index?: number;
  @Input('collection') collection!: string;
  @Input('boardTitle') boardTitle: boolean = false;
  @Output() showCatModal = new EventEmitter();
  @Output() addTicket = new EventEmitter();
  @Output() setBackground = new EventEmitter();
  @Output() boardPreviewEvent = new EventEmitter();
  @Output() moveColumnEvent = new EventEmitter();
  @ViewChild('titleInput') titleInput!: ElementRef;
  @ViewChild('menu') menu!: ElementRef;
  @ViewChild('editMenu') editMenu!: ElementRef;
  @ViewChild('moveColumnMenu') moveColumnMenu!: ElementRef;
  @ViewChild('saveTitleMenu') saveTitleMenu!: ElementRef;
  @ViewChild('hiddenSpan') hiddenSpan!: ElementRef;
  @HostListener('document:click', ['$event'])
  clickListener(event: any) {
    this.resetVariables(event);
  }
  @HostListener('window:resize', ['$event'])
  resizeListener(event: any) {
    this.checkMenu();
  }

  constructor(
    public fireService: FirestoreService,
    public dragService: DragNdropService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.title = this.hostObject.title;
    this.checkMenu();
  }

  ngAfterViewChecked(): void {
    this.checkWidth();
    this.cd.detectChanges();
  }

  checkWidth() {
    this.spanWidth = this.hiddenSpan.nativeElement.clientWidth;
  }

  toggleMenu() {
    if (!(this.boardTitle && window.innerWidth > 700)) {
      console.log('toggle');
      this.checkOpeningPosition();
      this.menuIsOpen = !this.menuIsOpen;
      this.emitBoardPreviewEvent();
    }
  }

  emitBoardPreviewEvent() {
    this.boardPreviewEvent.emit(this.menuIsOpen);
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
    this.toggleMenu();
    this.dragService.isEditingTitle = true;
    setTimeout(() => {
      this.titleInput.nativeElement.focus();
    }, 50);
  }

  resetVariables(event: any) {
    this.resetEditTitle(event);
    this.toggleMoveColumnMenu(event);
    if (!(this.boardTitle && window.innerWidth > 700))
      this.resetOpenMenu(event);
  }

  resetEditTitle(event: any) {
    if (
      event.target != this.titleInput.nativeElement &&
      event.target != this.saveTitleMenu?.nativeElement
    ) {
      this.isEditingTitle = false;
      this.dragService.isEditingTitle = false;
      this.title = this.hostObject.title;
    }
  }

  resetOpenMenu(event: any) {
    if (
      this.menuIsOpen &&
      event.target != this.editMenu.nativeElement &&
      event.target.parentElement.parentElement != this.menu.nativeElement
    ) {
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
    if (!this.title) {
      this.title = this.hostObject.title;
    } else if (this.title != this.hostObject.title) {
      this.fireService.updateDoc(this.collection, id, { title: this.title });
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

  setBackgroundImage(event: any) {
    event.stopPropagation();
    this.setBackground.emit(true);
    this.toggleMenu();
  }

  toggleMoveColumnMenu(event: any) {
    event.stopPropagation();
    if (event.target.id != 'current-column') {
      if (!event.target != this.moveColumnMenu?.nativeElement) {
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

  checkMenu() {
    if (this.boardTitle == true && window.innerWidth > 700) {
      console.log('if');
      this.menuIsOpen = true;
      this.bigger700 = true;
    } else if (this.boardTitle == true && window.innerWidth < 700) {
      console.log('else');
      this.menuIsOpen = false;
      this.bigger700 = false;
    }
  }
}
