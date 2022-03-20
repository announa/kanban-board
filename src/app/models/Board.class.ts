import { Column } from "./Column.class";

export class Board {
 title = '';
 columns?: Column;
 categories: string[];
 id: string;

 constructor(title: string, categories: string[]){
  this.title = title;
  this.categories = categories;
  this.id = (Math.random() * 1000000).toString();
 }
}