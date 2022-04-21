import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-set-bg',
  templateUrl: './set-bg.component.html',
  styleUrls: ['./set-bg.component.scss'],
})
export class SetBgComponent implements OnInit {
  @Input('selectedBoard') boardId!: string | undefined;
  @Output() imageSet = new EventEmitter();
  @Output() selectedImage = new EventEmitter();
  currentImage = '';
  newImage = '';
  images: string[] = [];

  constructor(private fireService: FirestoreService) {
    for (let i = 1; i < 8; i++) {
      this.images.push(`bg-${i}.jpg`);
    }
  }

  ngOnInit(): void {
    this.getCurrentImage();
  }

  getCurrentImage() {
    const board = this.fireService.getFilteredCollection(
      'boards',
      'id',
      '==',
      this.boardId
    );
    board.subscribe((b: any) => {
      this.currentImage = b[0].bgImg;
    });
  }

  selectImage(image: string) {
    this.newImage = image;
    this.selectedImage.emit(this.newImage)
  }

  closeModal() {
    this.newImage = '';
    this.imageSet.emit(true);
  }
  
  saveImage() {
    if (this.newImage != this.currentImage && this.boardId) {
      this.fireService.updateDoc('boards', this.boardId, {
        bgImg: this.newImage,
      });
    }
    this.newImage = '';
    this.imageSet.emit(true);
  }
}
