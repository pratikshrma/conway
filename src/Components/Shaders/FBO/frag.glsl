varying vec2 vUv;

uniform vec2 uMousePos;
uniform sampler2D uPrevTexture;
uniform vec2 uResolution;

bool isAlive(vec2 offset, vec2 onePixel) {
  vec2 coords = vUv + (offset * onePixel);
  vec4 tex = texture2D(uPrevTexture, coords);
  return tex.a > 0.5;
}

void main() {
  float dist = step(distance(vUv, uMousePos), .005);
  vec2 onePixel = vec2(1.0, 1.0) / uResolution;
  int alive = 0;

  for (float i = -1.0; i <= 1.0; i += 1.0) {
    for (float j = -1.0; j <= 1.0; j += 1.0) {
      if (i == 0.0 && j == 0.0) continue;
      alive += isAlive(vec2(i, j), onePixel) ? 1 : 0;
    }
  }

  bool nextStage = false;

  if (isAlive(vec2(0.0, 0.0), onePixel)) {
    if (alive == 2 || alive == 3) {
      nextStage = true;
    }
  } else {
    if (alive == 3) {
      nextStage = true;
    }
  }

  if (nextStage) {
    gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0);
  } else {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
  }

  if (dist > 0.5) {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
}
