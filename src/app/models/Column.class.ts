import { Ticket } from './Ticket.class';

export class Column {
  title = 'New Column';
  tickets?: Ticket[];
  order: string;
  id: string;

  constructor(order: number) {
    this.id = Date.now().toString();
    this.order = (order + 1).toString();
  }
}
