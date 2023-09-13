varying vec2 vUv;
uniform float uTime;
varying vec3 vPosition;
attribute vec3 aRandom;
attribute float aSize;
uniform float uProgress;

float PI = 3.141592653589793238;

vec3 getPosition(float progress) {
    float angle = progress * PI * 2.;
    float curveNumber = floor(progress * 3.);

    float x = sin(angle) + 2. * sin(angle * 2.);
    float y = cos(angle) - 2. * cos(angle * 2.);
    float z = -sin(angle * 3.);

    return vec3(x, y, z);
}

void main() {
    vUv = uv;
    float progress = fract(aRandom.x * 0.9 + uTime * 0.05);

    vec3 pos = position;
    pos += getPosition(progress) ;
    vPosition = pos;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = 30. * aSize * (1. / -(mvPosition.z * 2.5));
    gl_Position = projectionMatrix * mvPosition;
}