import { Column } from "./Column.class";

export class Board {
 title = 'New Board';
 categories?: string[];
 id: string = '';
 userId: string = '';

 constructor(){
  this.id = Date.now().toString();
 }
}