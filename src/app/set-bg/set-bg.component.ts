import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { firstValueFrom, Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AddTicketService } from '../services/add-ticket.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-set-bg',
  templateUrl: './set-bg.component.html',
  styleUrls: ['./set-bg.component.scss'],
})
export class SetBgComponent implements OnInit, OnDestroy {
  @Input('selectedBoard') boardId!: string | undefined;
  @Output() onCloseModal = new EventEmitter();
  @Output() selectedImage = new EventEmitter();
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('modal') modal!: ElementRef;
  currentImage = '';
  newImage = '';
  images: string[] = [];
  uploadPercent!: Observable<number | undefined>;
  uploadFinished = false;
  downloadURL!: Observable<string>;
  currentImageSubscription!: Subscription;

  constructor(
    public fireService: FirestoreService,
    public addTicketServ: AddTicketService,
    private storage: AngularFireStorage
  ) {
    for (let i = 1; i < 9; i++) {
      this.images.push(`assets/bg-img/bg-${i}.jpg`);
    }
  }

  ngOnInit(): void {
    this.getCurrentImage();
  }

  ngOnDestroy(): void {
    this.currentImageSubscription.unsubscribe();
  }

  getCurrentImage() {
    this.currentImageSubscription = this.fireService
      .getFilteredCollection('boards', 'id', '==', this.boardId)
      .subscribe((b: any) => {
        this.currentImage = b[0].bgImg;
      });
  }

  selectImage(image: string) {
    this.newImage = image;
    this.selectedImage.emit(this.newImage);
  }

  closeModal() {
    this.newImage = '';
    this.fireService.isProcessing = false;
    this.onCloseModal.emit(true);
  }

  saveImage() {
    if (this.newImage != this.currentImage && this.boardId) {
      this.fireService.updateDoc('boards', this.boardId, {
        bgImg: this.newImage,
      });
    }
    this.closeModal();
  }

  uploadImage(event: any) {
    this.fireService.isProcessing = true;
    const file = event.target.files[0];
    const filePath = `/bg-images/${
      this.fireService.currentUser?.uid
    }image${new Date().getTime()}`;
    const ref = this.storage.ref(filePath);
    const upload = ref.put(file);
    this.uploadPercent = upload.percentageChanges();
    upload
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.uploadFinished = true;
          this.modal.nativeElement.addEventListener(
            'click',
            this.resetVariables.bind(this),
            { once: true }
          );
          if(this.fireService.isProcessing)
          this.updateBoardImages(filePath);
        })
      )
      .subscribe();
  }

  async updateBoardImages(filePath: string) {
    const downloadUrl = await firstValueFrom(
      this.storage.ref(filePath).getDownloadURL()
    );
    if (this.fireService.currentUser?.username != '') {
      this.fireService.currentUser?.userImages.push({
        filePath: filePath,
        downloadUrl: downloadUrl,
      });
      if(this.fireService.currentUser){
      const collection = this.fireService.currentUser.username == 'guest' ? 'guest' : 'user'
      this.fireService.updateDoc(collection, this.fireService.currentUser.uid, {
        userImages: this.fireService.currentUser.userImages
      });
    }}
  }

  resetVariables() {
    this.fileInput.nativeElement.value = '';
    this.fireService.isProcessing = false;
    this.uploadFinished = false;
  }
}
