let cgol, pgA, pgB;
const UNIVERSE = { WIDTH: 512, HEIGHT: 512 };
const density = 50;
let destinationX, destinationY, destinationWidth, destinationHeight
let sourceX, sourceY, sourceWidth, sourceHeight
let panningSpeed = 1
let zoom = 1
let zoomSpeed = 0.01

window.preload = function () {
  cgol = loadShader("src/cgol.vert", "src/cgol.frag");
}

window.setup = function () {
  createCanvas(257, 145);
  background('red')
  noSmooth()

  pgA = createGraphics(UNIVERSE.WIDTH, UNIVERSE.HEIGHT, WEBGL);
  pgB = createGraphics(UNIVERSE.WIDTH, UNIVERSE.HEIGHT, WEBGL);

  bigBang(pgA, density)
  sourceX = sourceY = 0
}

window.draw = function () {
  controls()
  destinationX = destinationY = 0
  const majorAxis = max(width, height)
  destinationWidth = destinationHeight = majorAxis
  sourceWidth = sourceHeight = UNIVERSE.WIDTH * zoom
  image(pgA.get(), destinationX, destinationY, destinationWidth, destinationHeight, sourceX, sourceY, sourceWidth, sourceHeight);
  step()
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
    sourceY -= panningSpeed
  }
  if (keyIsDown(65)) {
    sourceX -= panningSpeed
  }
  if (keyIsDown(83)) {
    sourceY += panningSpeed
  }
  if (keyIsDown(68)) {
    sourceX += panningSpeed
  }

  if (keyIsDown(90)) {
    zoom += zoomSpeed
  }
  if (keyIsDown(88)) {
    zoom -= zoomSpeed
  }
  zoom = constrain(zoom, 0.05, 1)
}
