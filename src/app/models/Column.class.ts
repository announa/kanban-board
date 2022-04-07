import { Ticket } from './Ticket.class';

export class Column {
  title = 'New Column';
  order: number;
  id: string;
  boardId: string;
  

  constructor(order: number, boardId: string) {
    this.id = Date.now().toString();
    this.order = order + 1;
    this.boardId = boardId;
  }
}
