let next;
let restart;
let message;

function setup() {
  createCanvas(800, 600);
}

function draw() {
  let isRefilled = false;
  let isCentroidsChanged = false;
  next = createButton("Next").position(1380, 460).style("padding", "6px");
  restart = createButton("Restart").position(1430, 460).style("padding", "6px");
  noLoop();

  const circlesArray = [];
  background(196, 222, 245);
  fillPlane(100, circlesArray);
  const centroids = generateCentroids(4);
  drawCentroids(centroids);

  let distances = calculateDistance(centroids, circlesArray);
  let centroidsCircles = paintCircles(distances, centroids, circlesArray);

  next.mousePressed(() => {
    if (isCentroidsChanged) {
      distances = calculateDistance(centroids, circlesArray);
      centroidsCircles = paintCircles(
        distances,
        centroids,
        circlesArray,
        centroidsCircles,
      );
      isCentroidsChanged = false;
    }

    if (isRefilled && centroidsCircles) {
      changeCentroids(centroidsCircles, centroids);
      isCentroidsChanged = true;
      isRefilled = false;
    }

    refillPlane(circlesArray, centroids);
    isRefilled = true;
  });

  restart.mousePressed(() => {
    resetSketch(circlesArray, centroids);
    distances = [];
    draw();
    restart.remove();
    message.remove();
  });
}

function resetSketch(circlesArray, centroids) {
  for (let i = 0; i < circlesArray.length; i++) {
    circlesArray.pop();
  }

  for (let i = 0; i < centroids.length; i++) {
    centroids.pop();
  }
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

function fillPlane(length, circlesArray) {
  fill(circle.color);
  Array.from({ length: length }).forEach(() => {
    const circle = createCircle();
    circlesArray.push(circle);
    ellipse(circle.x, circle.y, circle.d);
  });
}

function refillPlane(circlesArray, centroids, isRefilled) {
  background(196, 222, 245);

  circlesArray.forEach((c) => {
    fill(c.color);
    ellipse(c.x, c.y, c.d);
  });

  drawCentroids(centroids);
}

function generateCentroids(k) {
  const centroids = [];
  const rate = 255 / k;
  Array.from({ length: k }).forEach((_, i) =>
    centroids.push({
      x: random(50, 750),
      y: random(50, 550),
      color: color(i * rate + rate, random(0, 255), random(0, 255)),
    }),
  );

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

function calculateDistance(centroids, circles) {
  const distances = [];
  centroids.forEach((centroid) => {
    const centroidDistance = [];
    circles.forEach((circle) => {
      centroidDistance.push(
        Math.sqrt(
          Math.pow(circle.x - centroid.x, 2) +
            Math.pow(circle.y - centroid.y, 2),
        ),
      );
    });
    distances.push(centroidDistance);
  });

  return distances;
}

function paintCircles(
  distances,
  centroids,
  circles,
  originalCentroidsCircles = [],
) {
  const centroidsCircles = [];
  const isEqual = [];

  for (let i = 0; i < circles.length; i++) {
    const minor = getMinorDistance(distances, i);

    circles[i].color = centroids[minor.idx].color;

    if (centroidsCircles[minor.idx]) {
      centroidsCircles[minor.idx].push({ x: circles[i].x, y: circles[i].y });
      continue;
    }

    centroidsCircles[minor.idx] = [{ x: circles[i].x, y: circles[i].y }];
  }

  if (originalCentroidsCircles.length > 0) {
    originalCentroidsCircles.forEach((oc, i) => {
      isEqual.push(oc.length === centroidsCircles[i].length);
    });
  }

  if (isEqual.length > 0 && isEqual.every((value) => value)) {
    message = createSpan("Convergence").addClass('convergence')
    next.attribute('disabled', 'true');
    next.style('pointer-events', 'none')
    return;
  }

  return centroidsCircles;
}

function getMinorDistance(distances, i) {
  const length = distances.length;
  let minor;
  for (let j = 0; j < distances.length; j++) {
    if (j === 0) {
      minor = { idx: j, value: distances[j][i] };
      continue;
    }

    if (distances[j][i] <= minor.value) {
      minor = { idx: j, value: distances[j][i] };
    }
  }

  return minor;
}

function changeCentroids(centroidsCircles, centroids) {
  const centroidsNewPositions = [];
  centroidsCircles.forEach((circles) => {
    let sumX = 0;
    let count = 0;
    let sumY = 0;
    circles.forEach((c) => {
      sumX += c.x;
      sumY += c.y;
      count++;
    });

    centroidsNewPositions.push({ x: sumX / count, y: sumY / count });
  });

  centroids.forEach((c, i) => {
    c.x = centroidsNewPositions[i].x;
    c.y = centroidsNewPositions[i].y;
  });
}
