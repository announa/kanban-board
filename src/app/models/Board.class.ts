export class Board {
  title = '';
  categories: {category: string, color: string}[] = [];
  id: string = '';
  userId: string = '';
  bgImg: string = '';
  placeholder: string = '';

  constructor(title?: string) {
    this.title = title ? title : '';
    this.id = title ? Date.now().toString() : '';
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
