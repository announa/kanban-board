export class Ticket{

 title = '';
 description = '';
 deadline?: string;
 date: Date;
 category?: string;
 priority?: string;
 id: number;
 progress = ''
 /* creator = ''; */
 /* users = []; */

 // transformed data for ordering when getting data from firestore
 title_transf = '';
 description_transf = '';

 constructor(){
  this.date = new Date()
  this.id = this.date.getTime();
 }

}