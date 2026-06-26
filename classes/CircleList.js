import { Circle } from "./Circle.js";

export class CircleList {
    circles;
    constructor() {
      this.circles = [];
    }
  
    generateCircles(length) {
      Array.from({ length }).forEach(() => this.circles.push(new Circle()));
      return this.circles;
    }
  
    drawCircles() {
      this.circles.forEach((c) => c.draw());
    }
  
    reset() {
      this.circles = [];
    }
  }