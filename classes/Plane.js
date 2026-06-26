export class Plane {
  circlesList;
  centroidsList;
  centroidsCirclesLengths;
  k;
  constructor(circlesList, centroidsList) {
    this.circlesList = circlesList;
    this.centroidsList = centroidsList;
    this.centroidsCirclesLengths = [];
    this.k = 5;
  }

  fillPlane() {
    this.circlesList.generateCircles(100);
    this.circlesList.drawCircles();
    this.centroidsList.generateCentroids(this.k);
    this.centroidsList.drawCentroids();
  }

  refillPlane() {
    background(196, 222, 245);

    this.circlesList.drawCircles();
    this.centroidsList.drawCentroids();
  }

  reset() {
    this.circlesList.reset();
    this.centroidsList.reset();
    this.centroidsCirclesLengths = [];
  }

  clusterCircles() {
    const distancesForEachCentroid = this.#calculateDistances();
    this.centroidsList.centroids.forEach((c) => (c.circles = []));
    for (let i = 0; i < this.circlesList.circles.length; i++) {
      const currentCircle = this.circlesList.circles[i];
      const index = this.#getClosestCentroidIndex(distancesForEachCentroid, i);
      const centroid = this.centroidsList.centroids[index];

      currentCircle.color = centroid.color;

      this.#insertCircleToCluster(centroid, currentCircle);
    }

    const isFinished = this.#isFinished();

    if (isFinished) {
      return true;
    }
    this.centroidsList.centroids.forEach(
      (c, i) => (this.centroidsCirclesLengths[i] = c.circles.length),
    );
  }

  #isFinished() {
    const lengths = this.centroidsList.centroids.map(
      (c, i) => c.circles.length,
    );
    const areClustersEqual = lengths.map(
      (l, i) => l === this.centroidsCirclesLengths[i],
    );

    const areEqual = this.#areClustersEqual(areClustersEqual);

    return areEqual;
  }

  #areClustersEqual(areClustersLengthsEqual) {
    return (
      areClustersLengthsEqual.length > 0 &&
      areClustersLengthsEqual.every((value) => value === true)
    );
  }

  #calculateDistances() {
    const distancesForEachCentroid = this.centroidsList.centroids.map(
      (centroid) => this.#calculateCirclesDistances(centroid),
    );

    return distancesForEachCentroid;
  }

  #calculateCirclesDistances(centroid) {
    const centroidCirclesDistances = this.circlesList.circles.map((circle) =>
      this.#calculateCircleDistance(circle, centroid),
    );

    return centroidCirclesDistances;
  }

  #calculateCircleDistance(circle, centroid) {
    const distance = Math.sqrt(
      Math.pow(circle.x - centroid.x, 2) + Math.pow(circle.y - centroid.y, 2),
    );

    return distance;
  }

  #getClosestCentroidIndex(distancesForEachCentroid, i) {
    const centroidsCount = distancesForEachCentroid.length;
    let closestCentroid = this.#setClosestCentroid(
      0,
      distancesForEachCentroid[0][i],
    );

    for (
      let centroidIndex = 1;
      centroidIndex < centroidsCount;
      centroidIndex++
    ) {
      const currentCircleDistance = distancesForEachCentroid[centroidIndex][i];

      if (currentCircleDistance <= closestCentroid.circleDistance) {
        closestCentroid = this.#setClosestCentroid(
          centroidIndex,
          currentCircleDistance,
        );
      }
    }

    return closestCentroid.index;
  }

  #setClosestCentroid(centroidIndex, currentCircleDistance) {
    return {
      index: centroidIndex,
      circleDistance: currentCircleDistance,
    };
  }

  #insertCircleToCluster(centroid, currentCircle) {
    centroid.circles.push(currentCircle);
    return;
  }
}
