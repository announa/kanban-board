import { Column } from "./Column.class";

export class Board {
 title = 'New Board';
 categories?: string[];
 id: string;
 columns!: string[];

 constructor(){
  this.id = Date.now().toString();
 }
}