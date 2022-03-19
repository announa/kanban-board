import { Ticket } from "./Ticket.class";

export class Column {
 title = '';
 tickets?: Ticket[];
 order!: number;
}