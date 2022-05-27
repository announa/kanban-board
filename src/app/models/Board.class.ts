export class Board {
  title = '';
  categories: {category: string, color: string}[] = [];
  id: string = '';
  uid: string = '';
  bgImg: string = '';
  placeholder: string = '';
  timestamp!: number;

  constructor(title: string) {
    this.title = title;
    this.timestamp = Date.now();
    this.bgImg = `assets/bg-img/bg-${Math.round(Math.random() * 7) + 1}.jpg`;
    this.placeholder = 'New Board';
  }

  getBgImage() {
    const bgImg = Math.round(Math.random() * 7);
    if (bgImg == 0) {
      this.getBgImage();
      return;
    } else return bgImg;
  }
}
