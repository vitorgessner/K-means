export class Circle {
    x;
    y;
    d;
    color;
    constructor() {
      this.x = random(50, 750);
      this.y = random(50, 550);
      this.d = 30;
      this.color = 0;
    }
  
    draw() {
      fill(this.color);
      ellipse(this.x, this.y, this.d);
    }
  }