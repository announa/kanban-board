import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-edit-board-menu',
  templateUrl: './edit-board-menu.component.html',
  styleUrls: ['./edit-board-menu.component.scss']
})
export class EditBoardMenuComponent implements OnInit {

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
  @Input('isBoardTitle') isBoardTitle: boolean = false;
  @Output() showCatModal = new EventEmitter();
  @Output() addTicket = new EventEmitter();
  @Output() setBackground = new EventEmitter();
  @Output() boardPreviewEvent = new EventEmitter();
  @Output() moveColumnEvent = new EventEmitter();
  @ViewChild('titleInput') titleInput!: ElementRef;
  @ViewChild('titleContainer') titleContainer!: ElementRef;
  @ViewChild('menu') menu!: ElementRef;
  @ViewChild('editMenu') editMenu!: ElementRef;
  @ViewChild('saveTitleMenu') saveTitleMenu!: ElementRef;
  @ViewChild('hiddenSpan') hiddenSpan!: ElementRef;
  @ViewChildren('edit') edit!: QueryList<ElementRef>;
  @ViewChildren('moveColumnMenu') moveColumnMenu!: QueryList<ElementRef>;
  @ViewChildren('titleItem') titleItemList!: QueryList<ElementRef>;
/*   @HostListener('document:click', ['$event'])
  clickListener(event: any) {
    this.resetVariables(event);
  } */

  constructor(public fireService: FirestoreService) { }

  ngOnInit(): void {
  }

/*  editTitle(event: any) {
    if (!this.boardTitleOnDesktopClicked(event)) event.stopPropagation();
    this.isEditingTitle = true;
    this.toggleMenu();
    this.dragService.isEditingTitle = true;
    setTimeout(() => {
      this.titleInput.nativeElement.focus();
    }, 50);
  } */
}
