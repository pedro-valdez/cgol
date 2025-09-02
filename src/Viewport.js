class ObservableViewport {
  // NOTE: Should this be static?
  static minimumObservableLength = 64
  static ZOOM = {
    IN: -1,
    OUT: 1,
  }
  static PAN = {
    // NOTE: (0, 0) is on the top left
    UP: [0, -1],
    LEFT: [-1, 0],
    RIGHT: [1, 0],
    DOWN: [0, 1],
  }

  constructor(ratioX, ratioY, width = 1024, height = 1024) {
    this.width = width
    this.height = height
    this.minorAxisLength = min(this.width, this.height)

    this.zoomScalar = 1
    this.zoomSpeed = 1
    this.minimumZoomScalar = ObservableViewport.minimumObservableLength / this.minorAxisLength

    this.panning = createVector(0, 0)
    this.panningSpeed = 1

    // TODO: `this.zoomScalar * this.minorAxisLength` should be it's own term.
    // TODO: This calculation is repeated in `zoom()`
    this.observable = createVector(ratioX, ratioY).normalize().mult(this.zoomScalar * this.minorAxisLength)
  }

  // TODO: What if you are zoomed in, panned all to the right, then zoom out?
  zoom(direction, dt) {
    this.zoomScalar += direction * this.zoomSpeed * (dt / 1000)
    this.zoomScalar = constrain(this.zoomScalar, this.minimumZoomScalar, 1)

    this.observable.normalize().mult(this.zoomScalar * this.minorAxisLength)
  }

  pan(direction, dt) {
    const unitBasis = createVector(...direction)
    this.panning.add(unitBasis.mult(this.panningSpeed * dt))

    this.panning.x = constrain(this.panning.x, 0, this.width - this.observable.x)
    this.panning.y = constrain(this.panning.y, 0, this.height - this.observable.y)
  }
}

export default ObservableViewport
