import ObservableViewport from "./Viewport"

let cgol, bigBang, bufferA, bufferB, viewport;
const density = 0.80;
let pause = true

const container = document.querySelector('#cgol-container')
const cgolCanvas = document.querySelector('#cgol')

window.preload = function () {
  cgol = loadShader("src/shaders/cgol.vert", "src/shaders/cgol.frag");
  bigBang = loadShader("src/shaders/bigBang.vert", "src/shaders/bigBang.frag");
}

window.setup = function () {
  createCanvas(container.clientWidth, container.clientHeight, WEBGL, cgolCanvas)

  viewport = new ObservableViewport(width, height)

  bufferA = createFramebuffer({
    width: viewport.width,
    height: viewport.height,
    textureFiltering: NEAREST,
  })
  bufferB = createFramebuffer({
    width: viewport.width,
    height: viewport.height,
    textureFiltering: NEAREST,
  })

  applyBigBang()
}

window.draw = function () {
  controls()

  image(bufferA, -width / 2, -height / 2, width, height, viewport.panning.x, viewport.panning.y, viewport.observable.x, viewport.observable.y);

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
    bufferA.begin()
    background(0)
    bufferA.end()
  }
  if (key === 'r') {
    applyBigBang()
  }
}

function applyCgol() {
  shader(cgol)
  cgol.setUniform("normalRes", [
    1.0 / viewport.width,
    1.0 / viewport.height,
  ])
  cgol.setUniform("tex", bufferA)

  bufferB.begin()
  noStroke()
  plane(viewport.width, viewport.height)
  bufferB.end()

  let temp = bufferA
  bufferA = bufferB
  bufferB = temp

  resetShader()
}

function applyBigBang() {
  shader(bigBang)
  bigBang.setUniform("uResolution", [viewport.width, viewport.height])
  bigBang.setUniform("uDensity", density)

  bufferA.begin()
  noStroke()
  plane(viewport.width, viewport.height)
  bufferA.end()

  resetShader()
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

