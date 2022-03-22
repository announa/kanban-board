import { Column } from "./Column.class";

export class Board {
 title = 'New Board';
 categories?: string[];
 id: string;
 columns!: Column[];

 constructor(){
  this.id = Date.now().toString();
 }
}