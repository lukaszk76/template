varying vec2 vUv;
uniform float uTime;
varying vec3 vWorldPosition;

void main() {
    vUv = uv;
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}