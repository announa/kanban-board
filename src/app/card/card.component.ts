import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @ViewChild('description') description!: ElementRef<any>;
  @ViewChild('descriptionText') descriptionText!: ElementRef<any>;

  constructor() {}

  ngOnInit(): void {}

  showCard() {
    this.description.nativeElement.classList.toggle('h-0');
    setTimeout(() => {
      this.descriptionText.nativeElement.classList.toggle('d-none');
    }, 100);
  }
}
