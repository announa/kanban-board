export class Ticket{

 title = '';
 description = '';
 deadline?: string;
 date: Date;
 category?: string;
 /* creator = ''; */
 priority?: string;
 /* users = []; */
 id: number;
 progress = ''

 constructor(){
  this.date = new Date()
  this.id = this.date.getTime();
 }
}