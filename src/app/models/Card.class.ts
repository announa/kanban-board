export class Card{

 title = '';
 description = '';
 limitDate?: string;
 date = '';
 category = '';
 /* creator = ''; */
 priority?: string;
 /* users = []; */
 id: number;
 progress = ''

 constructor(){

  this.id = Math.random() * 1000000;
 }
}