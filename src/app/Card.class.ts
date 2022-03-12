export class Card{

 title = '';
 description = '';
 category = ''
 user = [];
 id: number;

 constructor(){

  this.id = Math.random() * 1000000;
 }
}