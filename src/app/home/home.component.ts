import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  content = [{
    img: 'kanban.jpg',
    text: 'Create boards for your different work areas.'
  },
  {
    img: 'kanban0.jpg',
    text: 'Add columns to your boards to structure the progress.'
  },
  {
    img: 'kanban2.jpg',
    text: 'Create tickets that contain your tasks. Shift them from column to column according to your work progress.'
  },
  {
    img: 'kanban4.jpg',
    text: 'Add board categories with colors which you can assign to your tasks for giving them more structure.'
  },
  {
    img: 'kanban5.jpg',
    text: 'Personalize your board giving it the background image you like.'
  },
]

  constructor() { }

  ngOnInit(): void {
  }
}
