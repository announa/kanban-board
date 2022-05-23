export class Board {
  title = '';
  categories: {category: string, color: string}[] = [];
  id: string = '';
  uid: string = '';
  bgImg: string = '';
  placeholder: string = '';
  timestamp: string = '';

  constructor(title?: string) {
    this.title = title ? title : '';
    this.timestamp = title ? Date.now().toString() : '';
    this.bgImg = title ? `assets/bg-img/bg-${Math.round(Math.random() * 7) + 1}.jpg` : '';
    this.placeholder = title ? 'New Board' : ''
  }

  getBgImage() {
    const bgImg = Math.round(Math.random() * 7);
    if (bgImg == 0) {
      this.getBgImage();
      return;
    } else return bgImg;
  }
}
