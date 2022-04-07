import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-set-bg',
  templateUrl: './set-bg.component.html',
  styleUrls: ['./set-bg.component.scss'],
})
export class SetBgComponent implements OnInit {
  @Input('imageBoard') boardId!: string;
  @Output() imageSet = new EventEmitter();
  images: string[] = [];

  constructor(private fireService: FirestoreService) {
    for (let i = 1; i < 8; i++) {
      this.images.push(`bg-${i}.jpg`);
    }
  }

  ngOnInit(): void {}

  selectImage(image: string){
    this.fireService.setBgImage(image, this.boardId)
    this.imageSet.emit(true);
  }
}
