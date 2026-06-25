let next;
let restart;
let message;

function setup() {
  createCanvas(800, 600);
}

function draw() {
  noLoop();
  background(196, 222, 245);

  let isRefilled = false;
  let isCentroidsChanged = false;
  createControlButtons();

  const circles = fillPlane(100);
  const centroids = generateCentroids(4);
  drawCentroids(centroids);

  const distancesForEachCentroid = calculateDistances(centroids, circles);
  let centroidsClusters = clusterCircles(
    distancesForEachCentroid,
    centroids,
    circles,
  );

  next.mousePressed(() => {
    if (isCentroidsChanged) {
      centroidsClusters = recalculateDistances(
        centroids,
        circles,
        centroidsClusters,
      );
      isCentroidsChanged = false;
    }

    if (isRefilled && centroidsClusters) {
      recalculateCentroids(centroidsClusters, centroids);
      isCentroidsChanged = true;
      isRefilled = false;
    }

    refillPlane(circles, centroids);
    isRefilled = true;
  });

  resetAlgorithm(circles, centroids);
}

function recalculateDistances(
  centroids,
  circles,
  centroidsClusters,
) {
  const newDistancesForEachCentroid = calculateDistances(centroids, circles);
  centroidsClusters = clusterCircles(
    newDistancesForEachCentroid,
    centroids,
    circles,
    centroidsClusters,
  );

  return centroidsClusters;
}

function recalculateCentroids(centroidsClusters, centroids) {
  changeCentroidsPosition(centroidsClusters, centroids);
}

function createControlButtons() {
  next = createButton("Next").position(1380, 460).style("padding", "6px");
  restart = createButton("Restart").position(1430, 460).style("padding", "6px");
}

function resetAlgorithm(circles, centroids) {
  restart.mousePressed(() => {
    resetSketch(circles, centroids);
    distancesForEachCentroid = [];

    draw();

    restart.remove();
    message.remove();
  });
}

function resetSketch(circles, centroids) {
  for (let i = 0; i < circles.length; i++) {
    circles.pop();
  }

  for (let i = 0; i < centroids.length; i++) {
    centroids.pop();
  }
}

function fillPlane(length) {
  const circles = createCircles(length);
  circles.forEach((c) => {
    fill(c.color);
    ellipse(c.x, c.y, c.d);
  });

  return circles;
}

function createCircles(length) {
  const circles = Array.from({ length: length }).map(() => createCircle());

  return circles;
}

function createCircle(color = 0) {
  const x = random(50, 750);
  const y = random(50, 550);
  const circle = {
    x: x,
    y: y,
    d: 30,
    color: 0,
  };

  return circle;
}

function refillPlane(circles, centroids) {
  background(196, 222, 245);

  circles.forEach((c) => {
    fill(c.color);
    ellipse(c.x, c.y, c.d);
  });

  drawCentroids(centroids);
}

function generateCentroids(k) {
  const rate = 255 / k;
  const centroids = Array.from({ length: k }).map((_, i) => {
    return {
      x: random(50, 750),
      y: random(50, 550),
      color: color(i * rate + rate, random(0, 255), random(0, 255)),
    };
  });

  return centroids;
}

function drawCentroids(centroids) {
  centroids.forEach((c) => {
    drawSquare(c);
  });
}

function drawSquare(centroid) {
  fill(centroid.color);
  strokeWeight(3);
  square(centroid.x, centroid.y, 30);
}

function calculateDistances(centroids, circles) {
  const distancesForEachCentroid = centroids.map((centroid) =>
    calculateCirclesDistances(circles, centroid),
  );

  return distancesForEachCentroid;
}

function calculateCirclesDistances(circles, centroid) {
  const centroidCirclesDistances = circles.map((circle) =>
    calculateCircleDistance(circle, centroid),
  );

  return centroidCirclesDistances;
}

function calculateCircleDistance(circle, centroid) {
  const distance = Math.sqrt(
    Math.pow(circle.x - centroid.x, 2) + Math.pow(circle.y - centroid.y, 2),
  );

  return distance;
}

function clusterCircles(
  distancesForEachCentroid,
  centroids,
  circles,
  previousCentroidsClusters = [],
) {
  const centroidsClusters = [];

  for (let i = 0; i < circles.length; i++) {
    const currentCircle = circles[i];
    const index = getClosestCentroidIndex(distancesForEachCentroid, i);
    const centroid = centroids[index];

    currentCircle.color = centroid.color;

    insertCircleToCluster(centroidsClusters, index, currentCircle);
  }

  const areEqual = comparePreviousClusterToCurrent(
    previousCentroidsClusters,
    centroidsClusters,
  );

  if (areEqual) {
    finishUi();
  }

  return centroidsClusters;
}

function getClosestCentroidIndex(distancesForEachCentroid, i) {
  const centroidsCount = distancesForEachCentroid.length;
  let closestCentroid = setClosestCentroid(0, distancesForEachCentroid[0][i]);

  for (let centroidIndex = 1; centroidIndex < centroidsCount; centroidIndex++) {
    const currentCircleDistance = distancesForEachCentroid[centroidIndex][i];

    if (currentCircleDistance <= closestCentroid.circleDistance) {
      closestCentroid = setClosestCentroid(
        centroidIndex,
        currentCircleDistance,
      );
    }
  }

  return closestCentroid.index;
}

function setClosestCentroid(centroidIndex, currentCircleDistance) {
  return {
    index: centroidIndex,
    circleDistance: currentCircleDistance,
  };
}

function insertCircleToCluster(centroidsClusters, index, currentCircle) {
  if (centroidsClusters[index]) {
    centroidsClusters[index].push({ x: currentCircle.x, y: currentCircle.y });
    return;
  }

  centroidsClusters[index] = [{ x: currentCircle.x, y: currentCircle.y }];
}

function comparePreviousClusterToCurrent(
  previousCentroidsClusters,
  centroidsClusters,
) {
  const previouslyClustered = previousCentroidsClusters.length > 0;

  if (previouslyClustered) {
    const areClustersLengthsEqual = previousCentroidsClusters.map(
      (oc, i) => oc.length === centroidsClusters[i].length,
    );

    const areEqual = areClustersEqual(areClustersLengthsEqual);
    return areEqual;
  }
}

function areClustersEqual(areClustersLengthsEqual) {
  return (
    areClustersLengthsEqual.length > 0 &&
    areClustersLengthsEqual.every((value) => value)
  );
}

function finishUi() {
  message = createSpan("Convergence").addClass("convergence");
  next.attribute("disabled", "true");
  next.style("pointer-events", "none");
}

function changeCentroidsPosition(centroidsClusters, centroids) {
  const centroidsPositions = calculateCentroidsPointsAverage(centroidsClusters);

  centroids.forEach((c, i) => {
    c.x = centroidsPositions[i].x;
    c.y = centroidsPositions[i].y;
  });
}

function calculateCentroidsPointsAverage(centroidsClusters) {
  const centroidsPositions = centroidsClusters.map((circles) =>
    sumCirclesDistance(circles),
  );

  return centroidsPositions;
}

function sumCirclesDistance(circles) {
  let sumX = 0;
  let count = 0;
  let sumY = 0;
  circles.forEach((c) => {
    sumX += c.x;
    sumY += c.y;
    count++;
  });

  return { x: sumX / count, y: sumY / count };
}
