import { CircleList } from "./classes/CircleList.js";
import { CentroidList } from "./classes/CentroidList.js";
import { Plane } from "./classes/Plane.js";

let next;
let restart;
let increaseK;
let decreaseK;
let message;

function setup() {
  createCanvas(800, 600);
}

function draw() {
  noLoop();
  background(196, 222, 245);

  createControlButtons();

  const plane = new Plane(new CircleList(), new CentroidList());
  plane.fillPlane();

  plane.clusterCircles();

  let isRefilled = false;
  let isCentroidsChanged = false;
  next.mousePressed(() => {
    let isFinished = false;
    if (isCentroidsChanged) {
      isFinished = plane.clusterCircles();
      isCentroidsChanged = false;
    }

    if (isFinished) {
      finishUi();
    }

    if (isRefilled) {
      plane.centroidsList.changeCentroidsPosition();
      isCentroidsChanged = true;
      isRefilled = false;
    }

    plane.refillPlane();
    isRefilled = true;
  });

  restart.mousePressed(() => {
    plane.reset();

    draw();

    restart.remove();
    if (message) {
      message.remove();
    }
  });
}

function createControlButtons() {
  next = createButton("Next").position(1380, 460).style("padding", "6px");
  restart = createButton("Restart").position(1430, 460).style("padding", "6px");
}

function finishUi() {
  message = createSpan("Convergence").addClass("convergence");
  next.attribute("disabled", "true");
  next.style("pointer-events", "none");
}

window.setup = setup;
window.draw = draw;
