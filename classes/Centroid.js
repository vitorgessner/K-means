export class Centroid {
    x;
    y;
    color;
    circles;
    constructor() {
      this.x = random(50, 750);
      this.y = random(50, 550);
      this.color = color(random(0, 255), random(0, 255), random(0, 255));
      this.circles = [];
    }
  
    draw() {
      fill(this.color);
      strokeWeight(3);
      square(this.x, this.y, 30);
    }
  }