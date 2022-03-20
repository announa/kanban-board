import { Ticket } from './Ticket.class';

export class Column {
  title = 'New Column';
  tickets?: Ticket[];
  order!: number;
  id: string;

  constructor() {
    this.id = new Date().getTime().toString();
  }
}
