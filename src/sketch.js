import ObservableViewport from "./Viewport"

let cgol, bigBang, pgA, pgB, viewport;
const density = 0.80;
let pause = true

const container = document.querySelector('#cgol-container')
const cgolCanvas = document.querySelector('#cgol')
const pgACanvas = document.querySelector('#ping')
const pgBCanvas = document.querySelector('#pong')

window.preload = function () {
  cgol = loadShader("src/shaders/cgol.vert", "src/shaders/cgol.frag");
  bigBang = loadShader("src/shaders/bigBang.vert", "src/shaders/bigBang.frag");
}

window.setup = function () {
  createCanvas(container.clientWidth, container.clientHeight, undefined, cgolCanvas)
  noSmooth()

  viewport = new ObservableViewport(width, height)

  pgA = createGraphics(viewport.width, viewport.height, WEBGL, pgACanvas);
  pgB = createGraphics(viewport.width, viewport.height, WEBGL, pgBCanvas);

  applyBigBang()
}

window.draw = function () {
  controls()

  image(pgA.get(), 0, 0, width, height, viewport.panning.x, viewport.panning.y, viewport.observable.x, viewport.observable.y);

  if (!pause) {
    applyCgol()
  }
}

window.windowResized = function () {
  resizeCanvas(container.clientWidth, container.clientHeight)
}

window.keyTyped = function () {
  if (key === ' ') {
    pause = !pause
  }
  if (key === 'c') {
    pgA.background(0)
  }
  if (key === 'r') {
    applyBigBang()
  }
}

function applyCgol() {
  const cgolCopy = cgol.copyToContext(pgB)
  pgB.shader(cgolCopy)
  cgolCopy.setUniform("normalRes", [
    1.0 / pgB.width,
    1.0 / pgB.height,
  ])
  cgolCopy.setUniform("tex", pgA)

  pgB.noStroke()
  pgB.plane(pgB.width, pgB.height)

  let temp = pgA
  pgA = pgB
  pgB = temp
}

function applyBigBang() {
  const bigBangCopy = bigBang.copyToContext(pgA)
  pgA.shader(bigBangCopy)
  bigBangCopy.setUniform("uResolution", [pgA.width, pgA.height])
  bigBangCopy.setUniform("uDensity", density)

  pgA.noStroke()
  pgA.plane(pgA.width, pgA.height)
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

