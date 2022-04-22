export class Board {
  title = 'New Board';
  categories: string[] = [];
  id: string = '';
  userId: string = '';
  bgImg: string;

  constructor() {
    this.id = Date.now().toString();
    this.bgImg = `bg-${Math.round(Math.random() * 7) + 1}.jpg`;
    console.log(this.bgImg);
  }

  getBgImage() {
    const bgImg = Math.round(Math.random() * 7);
    if (bgImg == 0) {
      this.getBgImage();
      return;
    } else return bgImg;
  }
}
