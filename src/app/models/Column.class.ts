export class Column {
  title = '';
  order: number;
  id: string;
  boardId: string;
  placeholder: string = 'New Column';

  

  constructor(order: number, boardId: string) {
    this.id = Date.now().toString();
    this.order = order;
    this.boardId = boardId;
  }

  getOrder(){
    return this.order;
  }
}
