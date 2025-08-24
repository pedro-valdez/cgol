let cgol, pgA, pgB;

const UNIVERSE = { WIDTH: 256, HEIGHT: 256 };

const density = 10;

window.preload = function () {
  cgol = loadShader("src/cgol.vert", "src/cgol.frag");
}

window.setup = function () {
  createCanvas(256, 256, WEBGL);
  pgA = createGraphics(UNIVERSE.WIDTH, UNIVERSE.HEIGHT, WEBGL);
  pgB = createGraphics(UNIVERSE.WIDTH, UNIVERSE.HEIGHT, WEBGL);

  pgA.loadPixels();
  for (let i = 0; i < UNIVERSE.WIDTH * UNIVERSE.HEIGHT; i++) {
    const j = i * 4;
    const val = Math.random() * 100 > density ? 0 : 255;
    pgA.pixels[j + 0] = val;
    pgA.pixels[j + 1] = val;
    pgA.pixels[j + 2] = val;
    pgA.pixels[j + 3] = 255;
  }
  pgA.updatePixels();

  image(pgA.get(), -width / 2, -height / 2);
}

window.draw = function () {
  step()
}

function step() {
  const shaderForB = cgol.copyToContext(pgB);

  // Apply the shader to pgB
  pgB.shader(shaderForB);
  shaderForB.setUniform("normalRes", [
    1.0 / UNIVERSE.WIDTH,
    1.0 / UNIVERSE.HEIGHT,
  ]);
  shaderForB.setUniform("tex", pgA);

  pgB.noStroke()
  pgB.plane(UNIVERSE.WIDTH, UNIVERSE.HEIGHT);

  // Swap buffers
  let temp = pgA;
  pgA = pgB;
  pgB = temp;

  // Draw the result to the main canvas
  image(pgA, -width / 2, -height / 2);
}

