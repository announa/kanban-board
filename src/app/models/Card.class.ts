export class Card{

 title = '';
 description = '';
 deadline?: string;
 date = '';
 category?: string;
 /* creator = ''; */
 priority?: string;
 /* users = []; */
 id: number;
 progress = ''

 constructor(){

  this.id = Math.random() * 1000000;
 }
}