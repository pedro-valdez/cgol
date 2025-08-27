let cgol, pgA, pgB;
const UNIVERSE = { WIDTH: 256, HEIGHT: 256 };
const density = 50;

window.preload = function () {
  cgol = loadShader("src/cgol.vert", "src/cgol.frag");
}

window.setup = function () {
  createCanvas(256, 256, WEBGL);

  pgA = createGraphics(UNIVERSE.WIDTH, UNIVERSE.HEIGHT, WEBGL);
  pgB = createGraphics(UNIVERSE.WIDTH, UNIVERSE.HEIGHT, WEBGL);

  bigBang(pgA, density)
}

window.draw = function () {
  image(pgA.get(), -width / 2, -height / 2);
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
