let cgol, pgA, pgB;
const UNIVERSE = { WIDTH: 1024, HEIGHT: 1024 };
const density = 50;
let panningX = 0, panningY = 0, panningSpeed = 1
let zoom = 1, zoomSpeed = 0.01
let observableWidth, observableHeight

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

  pgA = createGraphics(UNIVERSE.WIDTH, UNIVERSE.HEIGHT, WEBGL, pgACanvas);
  pgB = createGraphics(UNIVERSE.WIDTH, UNIVERSE.HEIGHT, WEBGL, pgBCanvas);

  bigBang(pgA, density)
}

window.draw = function () {
  controls()

  observableWidth = UNIVERSE.WIDTH * zoom
  observableHeight = observableWidth * (height / width)

  image(pgA.get(), 0, 0, width, height, panningX, panningY, observableWidth, observableHeight);

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
  pgB.plane(UNIVERSE.WIDTH, UNIVERSE.HEIGHT);

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
    panningY -= panningSpeed
  }
  if (keyIsDown(65)) {
    panningX -= panningSpeed
  }
  if (keyIsDown(83)) {
    panningY += panningSpeed
  }
  if (keyIsDown(68)) {
    panningX += panningSpeed
  }

  if (keyIsDown(90)) {
    zoom += zoomSpeed
  }
  if (keyIsDown(88)) {
    zoom -= zoomSpeed
  }
  zoom = constrain(zoom, 0.05, 1)
}

