export class Column {
  title = '';
  order: number;
  id: string;
  boardId: string;
  placeholder: string = 'New Column';

  

  constructor(order: number, boardId: string) {
    this.id = Date.now().toString();
    this.order = order + 1;
    this.boardId = boardId;
  }
}
