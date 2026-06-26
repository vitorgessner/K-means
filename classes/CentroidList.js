import { Centroid } from "./Centroid.js";

export class CentroidList {
    centroids;
    constructor() {
      this.centroids = [];
    }
  
    generateCentroids(k) {
      Array.from({ length: k }).forEach(() =>
        this.centroids.push(new Centroid()),
      );
      return this.centroids;
    }
  
    drawCentroids() {
      this.centroids.forEach((c) => c.draw());
    }
  
    reset() {
      this.centroids = [];
    }
  
    changeCentroidsPosition() {
      this.centroids.forEach((c) => {
        const { x, y } = this.#calculateCentroidPointsAverage(c);
        c.x = x;
        c.y = y;
      });
    }
  
    #calculateCentroidPointsAverage(centroid) {
      let sumX = 0;
      let sumY = 0;
      let count = 0;
      centroid.circles.forEach((c) => {
        sumX += c.x;
        sumY += c.y;
        count++;
      });
  
      return { x: sumX / count, y: sumY / count };
    }
  }