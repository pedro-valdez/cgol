precision mediump float;

uniform vec2 uResolution;
uniform float uDensity;
uniform float uSeed;

/*
 * Found this function online:
 * https://stackoverflow.com/questions/4200224/random-noise-functions-for-glsl
 */
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233)) + uSeed) * 43758.5453123);
}

void main() {
  vec2 st = gl_FragCoord.xy / uResolution.xy;
  float rnd = random(st);
  float bw = step(uDensity, rnd);
  gl_FragColor = vec4(vec3(bw), 1.0);
}
