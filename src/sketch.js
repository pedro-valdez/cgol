import ObservableViewport from "./Viewport"

let cgol, pgA, pgB, viewport;
const density = 50;

const container = document.querySelector('#cgol-container')
const cgolCanvas = document.querySelector('#cgol')
const pgACanvas = document.querySelector('#ping')
const pgBCanvas = document.querySelector('#pong')

window.preload = function () {
  cgol = loadShader("src/cgol.vert", "src/cgol.frag");
}

window.setup = function () {
  createCanvas(container.clientWidth, container.clientHeight, undefined, cgolCanvas)
  noSmooth()

  viewport = new ObservableViewport(width, height)

  pgA = createGraphics(viewport.width, viewport.height, WEBGL, pgACanvas);
  pgB = createGraphics(viewport.width, viewport.height, WEBGL, pgBCanvas);

  bigBang(pgA, density)
}

window.draw = function () {
  controls()

  image(pgA.get(), 0, 0, width, height, viewport.panning.x, viewport.panning.y, viewport.observable.x, viewport.observable.y);

  step()
}

window.windowResized = function () {
  resizeCanvas(container.clientWidth, container.clientHeight)
}

function step() {
  copyCgolToContext(pgA, pgB)
  applyCgol()
}

function copyCgolToContext(pgA, pgB) {
  const cgolCopy = cgol.copyToContext(pgB);

  pgB.shader(cgolCopy);
  cgolCopy.setUniform("normalRes", [
    1.0 / pgB.width,
    1.0 / pgB.height,
  ]);
  cgolCopy.setUniform("tex", pgA);
}

function applyCgol() {
  pgB.noStroke()
  pgB.plane(viewport.width, viewport.height);

  let temp = pgA;
  pgA = pgB;
  pgB = temp;
}

function bigBang(pg, density) {
  pg.loadPixels();
  for (let i = 0; i < pg.width * pg.height; i++) {
    const j = i * 4;
    const val = Math.random() * 100 > density ? 0 : 255;
    pg.pixels[j + 0] = val;
    pg.pixels[j + 1] = val;
    pg.pixels[j + 2] = val;
    pg.pixels[j + 3] = 255;
  }
  pg.updatePixels();
}

function controls() {
  if (keyIsDown(87)) {
    viewport.pan(ObservableViewport.PAN.UP, deltaTime)
  }
  if (keyIsDown(65)) {
    viewport.pan(ObservableViewport.PAN.LEFT, deltaTime)
  }
  if (keyIsDown(83)) {
    viewport.pan(ObservableViewport.PAN.DOWN, deltaTime)
  }
  if (keyIsDown(68)) {
    viewport.pan(ObservableViewport.PAN.RIGHT, deltaTime)
  }

  if (keyIsDown(90)) {
    viewport.zoom(ObservableViewport.ZOOM.OUT, deltaTime)
  }
  if (keyIsDown(88)) {
    viewport.zoom(ObservableViewport.ZOOM.IN, deltaTime)
  }
}

