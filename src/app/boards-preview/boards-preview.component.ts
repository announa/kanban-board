import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../services/firestore.service';
import { TitleComponent } from '../title/title.component';

@Component({
  selector: 'app-boards-preview',
  templateUrl: './boards-preview.component.html',
  styleUrls: ['./boards-preview.component.scss'],
})
export class BoardsPreviewComponent implements OnInit {
  @Input('board') board: any;
  @Output() setBackground = new EventEmitter();
  @ViewChild(TitleComponent) title!: TitleComponent;
  zIndex = false;

  constructor(public fireService: FirestoreService, private router: Router) {}

  ngOnInit(): void {}

  navigate(boardId: string, event: any) {
    if (event.target.parentElement.parentElement != this.title.menu.nativeElement) {
      this.router.navigateByUrl('/board/' + boardId);
    }
  }

  setBackgroundImage() {
    this.setBackground.emit(this.board.id);
  }

  setZindex(menuIsOpen: boolean) {
    this.zIndex = menuIsOpen;
  }
}
