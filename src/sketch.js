import ObservableViewport from './Viewport'

let cgol, bigBang, bufferA, bufferB, viewport
const density = 0.8
let pause = true
let simulationDeltaTime = 0,
    simulationDelay = 64
let brushThickness = 3

const container = document.querySelector('#cgol-container')
const cgolCanvas = document.querySelector('#cgol')
cgolCanvas.addEventListener('contextmenu', (e) => e.preventDefault())

window.preload = function () {
    cgol = loadShader('src/shaders/cgol.vert', 'src/shaders/cgol.frag')
    bigBang = loadShader('src/shaders/bigBang.vert', 'src/shaders/bigBang.frag')
}

window.setup = function () {
    createCanvas(
        container.clientWidth,
        container.clientHeight,
        WEBGL,
        cgolCanvas
    )

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
    simulationDeltaTime += deltaTime

    controls()

    image(
        bufferA,
        -width / 2,
        -height / 2,
        width,
        height,
        viewport.panning.x,
        viewport.panning.y,
        viewport.observable.x,
        viewport.observable.y
    )

    if (!pause && simulationDeltaTime >= simulationDelay) {
        applyCgol()
        simulationDeltaTime = 0
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
    if (key === 'n' && pause) {
        applyCgol()
    }
}

window.mousePressed = function () {
    modifyCell()
}
window.mouseDragged = function () {
    modifyCell()
}

function modifyCell() {
    const viewportX = Math.floor(
        viewport.panning.x + (mouseX * viewport.observable.x) / width
    )
    const viewportY = Math.floor(
        viewport.panning.y + (mouseY * viewport.observable.y) / height
    )

    const cellColor =
        mouseButton === LEFT ? 255 : mouseButton === RIGHT ? 0 : undefined
    if (cellColor !== undefined) {
        bufferA.begin()
        noStroke()
        fill(cellColor)
        square(
            viewportX - viewport.width / 2,
            viewportY - viewport.height / 2,
            brushThickness
        )
        bufferA.end()
    }
}

function applyCgol() {
    shader(cgol)
    cgol.setUniform('normalRes', [1.0 / viewport.width, 1.0 / viewport.height])
    cgol.setUniform('tex', bufferA)

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
    bigBang.setUniform('uResolution', [viewport.width, viewport.height])
    bigBang.setUniform('uDensity', density)

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
