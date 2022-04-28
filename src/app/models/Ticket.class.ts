export class Ticket{

 title = '';
 description = '';
 deadline?: string;
 date!: Date;
 category!: number;
 priority: string = '';
 id!: string;
 columnId: string;
 boardId: string;
 /* creator = ''; */
 /* users = []; */

 // transformed data for ordering when getting data from firestore
 title_transf = '';
 description_transf = '';

 constructor(columnId: string, boardId: string){
  this.columnId = columnId;
  this.boardId = boardId;
 }

}