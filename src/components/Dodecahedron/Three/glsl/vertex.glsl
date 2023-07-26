varying vec2 vUv;
uniform float uTime;
uniform float progress;


void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}